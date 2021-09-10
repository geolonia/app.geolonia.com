import React from 'react';

// i18n
import { loadLocale } from '../lib/load-locale';
import { setLocaleData } from '@wordpress/i18n';

// API
import { getSession } from './';
import getUser from '../api/users/get';

// Utils
import estimateLanguage from '../lib/estimate-language';

// redux
import { connect } from 'react-redux';
import {
  getInTrouble,
  ready,
  setLoggedIn,
} from '../redux/actions/auth-support';
import {
  set as setUserMeta,
  setAvatar,
  isUserMeta,
} from '../redux/actions/user-meta';
import {
  selectTeam,
} from '../redux/actions/team';
import { createActions as createTeamMemberActions } from '../redux/actions/team-member';

// Types
import Redux from 'redux';
import Moment from 'moment';
import mixpanel from 'mixpanel-browser';

type OwnProps = { children: React.ReactElement };
type StateProps = { session: Geolonia.Session };
type DispatchProps = {
  serverTrouble: () => void;
  ready: () => void;
  setLoggedIn: (loggedIn: boolean) => void;
  setUserMeta: (userMeta: Geolonia.User) => void;
  selectTeam: (teamId: string) => void;
  setUserAvatar: (avatarImage: string | void) => void;
  setTeamMemberAvatar: (
    teamId: string,
    userSub: string,
    avatarImage: string | void
  ) => void;
  setTeamMembers: (teamId: string, members: Geolonia.Member[]) => void;
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
    /*more API loads here*/
  ]).then(([userResult]) => {
    const user = userResult.error
      ? void 0
      : { ...userResult.data.item, links: userResult.data.links };
    return {
      user,
    };
  });
};

export class AuthContainer extends React.Component<Props, State> {
  async componentDidMount() {
    const session = await getSession();

    if (session === null) {
      setLocaleData(loadLocale(estimateLanguage()));
      this.props.setLoggedIn(false);
      return this.props.ready();
    }

    const idTokenPayload = session.getIdToken().payload;
    mixpanel.identify(idTokenPayload.sub);
    mixpanel.alias(idTokenPayload['cognito:username']);
    mixpanel.people.set('$name', idTokenPayload['cognito:username']);
    mixpanel.people.set('$email', idTokenPayload.email);

    try {
      const { user } = (await fundamentalAPILoads(
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

      this.props.setLoggedIn(true);
      this.props.setUserMeta(user);

      const { language, timezone } = user;
      const localeData = loadLocale(language);
      if (localeData) {
        setLocaleData(localeData);
      }
      Moment.locale(language);
      Moment.tz.setDefault(timezone);
      // NOTE: We can localize datetime format here
      Moment.defaultFormat = 'YYYY-MM-DD HH:mm:ss';

    } catch (error) {
      this.props.serverTrouble();
      this.props.setLoggedIn(false);
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

  loadAvatars = (userMeta: Geolonia.User) => {
    return Promise.all([
      userMeta.links.getAvatar
        ? fetch(userMeta.links.getAvatar)
          .then(this._handleAvatarResponse)
          .catch((err) => {
            return void 0;
          })
        : void 0,
    ]).then(([userAvatarImage]) => {
      this.props.setUserAvatar(userAvatarImage);
    });
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
  serverTrouble: () => dispatch(getInTrouble()),
  ready: () => dispatch(ready()),
  setLoggedIn: (loggedIn) => dispatch(setLoggedIn(loggedIn)),
  setUserMeta: (userMeta) => dispatch(setUserMeta(userMeta)),
  selectTeam: (teamId) => dispatch(selectTeam({ teamId })),
  setUserAvatar: (avatarImage) =>
    dispatch(setAvatar({avatarImage})),
  setTeamMemberAvatar: (teamId, userSub, avatarImage) =>
    dispatch(createTeamMemberActions.setAvatar(teamId, userSub, avatarImage)),
  setTeamMembers: (teamId, members) =>
    dispatch(createTeamMemberActions.set(teamId, members)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthContainer);
