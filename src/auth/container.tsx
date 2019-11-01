import React from "react";

// i18n
import { loadLocale } from "../lib/loadLocale";
import { setLocaleData } from "@wordpress/i18n";

// API
import { getSession } from "./";
import getUserMeta from "../api/users/get";
import listTeams from "../api/teams/list";
import listKeys from "../api/keys/list";
import listTeamMembers from "../api/members/list";

// Utils
import delay from "../lib/promise-delay";

// redux
import { connect } from "react-redux";
import { createActions as createAuthSupportActions } from "../redux/actions/auth-support";
import {
  createActions as createUserMetaActions,
  isUserMeta
} from "../redux/actions/user-meta";
import {
  createActions as createTeamActions,
  isTeam
} from "../redux/actions/team";
import { createActions as createMapKeyActions } from "../redux/actions/map-key";
import {
  createActions as createTeamMemberActions,
  Roles
} from "../redux/actions/team-member";

// Types
import { UserMetaState } from "../redux/actions/user-meta";
import { AppState } from "../redux/store";
import { Team } from "../redux/actions/team";
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";
import Redux from "redux";
import { Key } from "../redux/actions/map-key";
import { Member } from "../redux/actions/team-member";
import { SELECTED_TEAM_ID } from "../redux/middlewares/local-storage";

type OwnProps = {};
type StateProps = {
  session?: AmazonCognitoIdentity.CognitoUserSession;
};
type DispatchProps = {
  setSession: (session: AmazonCognitoIdentity.CognitoUserSession) => void;
  setAccessToken: (accessToken: string) => void;
  serverTrouble: () => void;
  ready: () => void;
  setUserMeta: (userMeta: UserMetaState) => void;
  setTeams: (teams: Team[]) => void;
  selectTeam: (index: number) => void;
  setUserAvatar: (avatarImage: string | void) => void;
  setTeamAvatar: (teamIndex: number, avatarImage: string | void) => void;
  setMapKeys: (teamId: string, keys: Key[]) => void;
  setTeamMembers: (teamId: string, members: Member[]) => void;
  markMapKeyError: (teamId: string) => void;
};
type Props = OwnProps & StateProps & DispatchProps;

type State = {};

type APIResult = {
  teams: Team[];
  userMeta: UserMetaState;
};

const fundamentalAPILoads = (
  session: AmazonCognitoIdentity.CognitoUserSession
) => {
  return Promise.all([
    getUserMeta(session),
    listTeams(session)
    /*more API loads here*/
  ]).then(([userMeta, teams]) => ({
    userMeta,
    teams
  }));
};

const getTeamIdToSelect = async (teams: Team[]) => {
  const prevTeamId = localStorage.getItem(SELECTED_TEAM_ID) || "";
  const teamIndex = teams.map(team => team.teamId).indexOf(prevTeamId);
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
      return this.props.ready();
    }

    try {
      const { userMeta, teams } = (await delay(
        fundamentalAPILoads(session),
        500
      )) as APIResult;

      if (!isUserMeta(userMeta)) {
        throw new Error("invalid user meta response");
      }

      if (teams.some(team => !isTeam(team))) {
        console.log(teams);
        throw new Error("invalid team response");
      }

      const teamsWithoutDeleted = (Array.isArray(teams) ? teams : []).filter(
        team => !team.isDeleted
      );
      this.props.setSession(session);
      this.props.setUserMeta(userMeta);
      this.props.setTeams(teamsWithoutDeleted);
      const { language } = userMeta;
      const localeData = loadLocale(language);
      if (localeData) {
        setLocaleData(localeData);
      }

      const teamIds = teamsWithoutDeleted.map(team => team.teamId);

      // do not await then.
      this.loadAvatars(userMeta, teamsWithoutDeleted);
      this.loadMapKeys(session, teamIds);
      this.loadTeamMembers(session, teamIds);
      getTeamIdToSelect(teamsWithoutDeleted).then(this.props.selectTeam);
    } catch (error) {
      console.error(error);
      this.props.serverTrouble();
    } finally {
      this.props.ready();
    }
  }

  loadAvatars = (userMeta: UserMetaState, teams: Team[]) => {
    const handleResponse = (res: Response) => {
      if (res.ok) {
        return res.blob().then(URL.createObjectURL);
      } else {
        throw new Error("Request failed");
      }
    };

    return Promise.all([
      fetch(userMeta.links.getAvatar)
        .then(handleResponse)
        .catch(err => {
          console.error(err);
          return void 0;
        }),
      ...teams.map(team =>
        fetch(team.links.getAvatar)
          .then(handleResponse)
          .catch(err => {
            console.error(err);
            return void 0;
          })
      )
    ]).then(([userAvatarImage, ...teamAvatarImages]) => {
      this.props.setUserAvatar(userAvatarImage);
      teamAvatarImages.map((teamAvatarImage, index) =>
        this.props.setTeamAvatar(index, teamAvatarImage)
      );
    });
  };

  loadMapKeys = (
    session: AmazonCognitoIdentity.CognitoUserSession,
    teamIds: string[]
  ) => {
    const handleListKeys = (teamId: string) => {
      return listKeys(session, teamId)
        .then(keys => {
          this.props.setMapKeys(teamId, keys);
        })
        .catch(err => {
          console.error(err);
          this.props.markMapKeyError(teamId);
        });
    };

    return Promise.all(teamIds.map(teamId => handleListKeys(teamId)));
  };

  loadTeamMembers = (
    session: AmazonCognitoIdentity.CognitoUserSession,
    teamIds: string[]
  ) => {
    const handleListTeamMembers = (teamId: string) => {
      return listTeamMembers(session, teamId)
        .then((members: Member[]) => {
          this.props.setTeamMembers(teamId, members);
        })
        .catch(err => {
          console.error(err);
        });
    };

    return Promise.all(teamIds.map(teamId => handleListTeamMembers(teamId)));
  };

  render() {
    const { children } = this.props;
    return <>{children}</>;
  }
}

const mapStateToProps = (state: AppState): StateProps => ({
  session: state.authSupport.session
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): DispatchProps => ({
  setSession: session => dispatch(createAuthSupportActions.setSession(session)),
  setAccessToken: accessToken =>
    dispatch(createAuthSupportActions.setAccessToken(accessToken)),
  serverTrouble: () => dispatch(createAuthSupportActions.encounterTrouble()),
  ready: () => dispatch(createAuthSupportActions.ready()),
  setUserMeta: userMeta => dispatch(createUserMetaActions.set(userMeta)),
  setTeams: teams => dispatch(createTeamActions.set(teams)),
  selectTeam: index => dispatch(createTeamActions.select(index)),
  setUserAvatar: avatarImage =>
    dispatch(createUserMetaActions.setAvatar(avatarImage)),
  setTeamAvatar: (teamIndex, avatarImage) =>
    dispatch(createTeamActions.setAvatar(teamIndex, avatarImage)),
  setMapKeys: (teamId, keys) => dispatch(createMapKeyActions.set(teamId, keys)),
  setTeamMembers: (teamId, members) =>
    dispatch(createTeamMemberActions.set(teamId, members)),
  markMapKeyError: teamId => dispatch(createMapKeyActions.markError(teamId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthContainer);
