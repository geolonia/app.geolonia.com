import React from 'react';

// i18n
import { loadLocale } from '../lib/load-locale';
import { setLocaleData } from '@wordpress/i18n';

// API
import { getSession } from './';
import getUser from '../api/users/get';
import listTeams from '../api/teams/list';
import listKeys from '../api/keys/list';
import listTeamMembers from '../api/members/list';

// Utils
import dateParse from '../lib/date-parse';
import estimateLanguage from '../lib/estimate-language';

// redux
import { connect } from 'react-redux';
import { createActions as createAuthSupportActions } from '../redux/actions/auth-support';
import {
  createActions as createUserMetaActions,
  isUserMeta,
} from '../redux/actions/user-meta';
import {
  createActions as createTeamActions,
  isTeam,
} from '../redux/actions/team';
import { createActions as createMapKeyActions } from '../redux/actions/map-key';
import { createActions as createTeamMemberActions } from '../redux/actions/team-member';

// Types
import Redux from 'redux';
import { SELECTED_TEAM_ID_KEY } from '../redux/middlewares/local-storage';
import Moment from 'moment';
import mixpanel from 'mixpanel-browser';

type OwnProps = { children: React.ReactElement };
type StateProps = { session: Geolonia.Session };
type DispatchProps = {
  setSession: (session: Geolonia.Session) => void;
  setAccessToken: (accessToken: string) => void;
  serverTrouble: () => void;
  ready: () => void;
  setUserMeta: (userMeta: Geolonia.User) => void;
  setTeams: (teams: Geolonia.Team[]) => void;
  selectTeam: (index: number) => void;
  setUserAvatar: (avatarImage: string | void) => void;
  setTeamAvatar: (teamIndex: number, avatarImage: string | void) => void;
  setTeamMemberAvatar: (
    teamId: string,
    userSub: string,
    avatarImage: string | void
  ) => void;
  setMapKeys: (teamId: string, keys: Geolonia.Key[]) => void;
  setTeamMembers: (teamId: string, members: Geolonia.Member[]) => void;
  markMapKeyError: (teamId: string) => void;
};
type Props = OwnProps & StateProps & DispatchProps;

type State = Record<string, never>;

type FundamentalAPIResult = {
  teams: Geolonia.Team[];
  user: Geolonia.User;
};

const fundamentalAPILoads = (session: Geolonia.Session) => {
  if (!session) {
    return Promise.reject('nosession');
  }
  return Promise.all([
    getUser(session),
    listTeams(session),
    /*more API loads here*/
  ]).then(([userResult, teamsResult]) => {
    const user = userResult.error
      ? void 0
      : { ...userResult.data.item, links: userResult.data.links };
    const teams = teamsResult.error ? void 0 : teamsResult.data;
    return {
      user,
      teams,
    };
  });
};

const getTeamIdToSelect = async (teams: Geolonia.Team[]) => {
  const prevTeamId = localStorage.getItem(SELECTED_TEAM_ID_KEY) || '';
  const teamIndex = teams.map((team) => team.teamId).indexOf(prevTeamId);
  if (teamIndex > -1) {
    return teamIndex;
  } else {
    return 0;
  }
};

export class AuthContainer extends React.Component<Props, State> {
  async componentDidMount() {
    const session = await getSession();

    if (session === null) {
      setLocaleData(loadLocale(estimateLanguage()));
      return this.props.ready();
    }

    const idTokenPayload = session.getIdToken().payload;
    mixpanel.identify(idTokenPayload.sub);
    mixpanel.alias(idTokenPayload['cognito:username']);
    mixpanel.people.set('$name', idTokenPayload['cognito:username']);
    mixpanel.people.set('$email', idTokenPayload.email);

    try {
      const { user, teams } = (await fundamentalAPILoads(
        session,
      )) as FundamentalAPIResult;
      if (!isUserMeta(user)) {
        throw new Error('invalid user meta response');
      }

      // ログイン時に毎回ユーザーの言語をローカルストレージに保存しておく。
      // ログアウトしたときの多言語化で使うため
      if (user.language) {
        localStorage.setItem('geolonia__persisted_language', user.language);
      }

      if (teams.some((team) => !isTeam(team))) {
        throw new Error('invalid team response');
      }

      const teamsWithoutDeleted = (Array.isArray(teams) ? teams : []).filter(
        (team) => !team.isDeleted,
      );
      this.props.setSession(session);
      this.props.setUserMeta(user);
      this.props.setTeams(teamsWithoutDeleted);

      const { language, timezone } = user;
      const localeData = loadLocale(language);
      if (localeData) {
        setLocaleData(localeData);
      }
      Moment.locale(language);
      Moment.tz.setDefault(timezone);
      // NOTE: We can localize datetime format here
      Moment.defaultFormat = 'YYYY-MM-DD HH:mm:ss';

      const teamIds = teamsWithoutDeleted.map((team) => team.teamId);

      await getTeamIdToSelect(teamsWithoutDeleted).then(this.props.selectTeam);

      // do not await then.
      this.loadAvatars(user, teamsWithoutDeleted);
      this.loadMapKeys(session, teamIds);
      this.loadTeamMembers(session, teamIds);
    } catch (error) {
      this.props.serverTrouble();
    } finally {
      this.props.ready();
    }
  }

  _handleAvatarResponse = (res: Response) => {
    if (res.ok) {
      return res.blob().then(URL.createObjectURL);
    } else {
      throw new Error('Request failed');
    }
  };

  loadAvatars = (userMeta: Geolonia.User, teams: Geolonia.Team[]) => {
    return Promise.all([
      userMeta.links.getAvatar
        ? fetch(userMeta.links.getAvatar)
          .then(this._handleAvatarResponse)
          .catch((err) => {
            return void 0;
          })
        : void 0,
      ...teams.map((team) =>
        team.links.getAvatar
          ? fetch(team.links.getAvatar)
            .then(this._handleAvatarResponse)
            .catch((err) => {
              return void 0;
            })
          : void 0,
      ),
    ]).then(([userAvatarImage, ...teamAvatarImages]) => {
      this.props.setUserAvatar(userAvatarImage);
      teamAvatarImages.map((teamAvatarImage, index) =>
        this.props.setTeamAvatar(index, teamAvatarImage),
      );
    });
  };

  loadMapKeys = (session: Geolonia.Session, teamIds: string[]) => {
    const handleListKeys = (teamId: string) => {
      return listKeys(session, teamId)
        .then((result) => {
          if (result.error) {
            throw result.error;
          } else {
            const data = result.data.map((x) => dateParse(x));
            this.props.setMapKeys(teamId, data);
          }
        })
        .catch((err) => {
          this.props.markMapKeyError(teamId);
        });
    };

    return Promise.all(teamIds.map((teamId) => handleListKeys(teamId)));
  };

  loadTeamMembers = (session: Geolonia.Session, teamIds: string[]) => {
    const handleListTeamMembersRequest = (teamId: string) => {
      return listTeamMembers(session, teamId).then((result) => {
        if (result.error) {
          throw new Error(result.code);
        } else {
          const members = result.data;
          this.props.setTeamMembers(teamId, members);
          return members;
        }
      });
    };

    return Promise.all(
      teamIds.map((teamId) =>
        handleListTeamMembersRequest(teamId).then((members) => {
          return Promise.all(
            members.map((member) =>
              member.links.getAvatar
                ? fetch(member.links.getAvatar)
                  .then(this._handleAvatarResponse)
                : void 0,
            ),
          ).then((teamMemberAvatarImages) => {
            teamMemberAvatarImages.map((avatarImage, index) => {
              return this.props.setTeamMemberAvatar(
                teamId,
                members[index].userSub,
                avatarImage,
              );
            });
          });
        }),
      ),
    );
  };

  render() {
    const { children } = this.props;
    return <>{children}</>;
  }
}

const mapStateToProps = (state: Geolonia.Redux.AppState): StateProps => ({
  session: state.authSupport.session,
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): DispatchProps => ({
  setSession: (session) =>
    session && dispatch(createAuthSupportActions.setSession(session)),
  setAccessToken: (accessToken) =>
    dispatch(createAuthSupportActions.setAccessToken(accessToken)),
  serverTrouble: () => dispatch(createAuthSupportActions.encounterTrouble()),
  ready: () => dispatch(createAuthSupportActions.ready()),
  setUserMeta: (userMeta) => dispatch(createUserMetaActions.set(userMeta)),
  setTeams: (teams) => dispatch(createTeamActions.set(teams)),
  selectTeam: (index) => dispatch(createTeamActions.select(index)),
  setUserAvatar: (avatarImage) =>
    dispatch(createUserMetaActions.setAvatar(avatarImage)),
  setTeamAvatar: (teamIndex, avatarImage) =>
    dispatch(createTeamActions.setAvatar(teamIndex, avatarImage)),
  setTeamMemberAvatar: (teamId, userSub, avatarImage) =>
    dispatch(createTeamMemberActions.setAvatar(teamId, userSub, avatarImage)),
  setMapKeys: (teamId, keys) => dispatch(createMapKeyActions.set(teamId, keys)),
  setTeamMembers: (teamId, members) =>
    dispatch(createTeamMemberActions.set(teamId, members)),
  markMapKeyError: (teamId) => dispatch(createMapKeyActions.markError(teamId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthContainer);
