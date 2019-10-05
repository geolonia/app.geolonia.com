import React from "react";

// i18n
import { loadLocale } from "../lib/loadLocale";
import { setLocaleData } from "@wordpress/i18n";

// API
import { getSession } from "./";
import getUserMeta from "../api/users/get";
import listTeams from "../api/teams/list";

// Utils
import delay from "../lib/promise-delay";

// redux
import { connect } from "react-redux";
import { createActions as createAuthSupportActions } from "../redux/actions/auth-support";
import { createActions as createUserMetaActions } from "../redux/actions/user-meta";
import { createActions as createTeamActions } from "../redux/actions/team";

// Types
import { UserMetaState } from "../redux/actions/user-meta";
import { AppState } from "../redux/store";
import { Team } from "../redux/actions/team";
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";
import Redux from "redux";

type Props = {
  session?: AmazonCognitoIdentity.CognitoUserSession;
  setSession: (session: AmazonCognitoIdentity.CognitoUserSession) => void;
  setAccessToken: (accessToken: string) => void;
  serverTrouble: () => void;
  ready: () => void;
  setUserMeta: (userMeta: UserMetaState) => void;
  setTeams: (teams: Team[]) => void;
};

type State = {};

type APIResult = {
  teams: Team[];
  userMeta: UserMetaState;
};

const APILoads = (session: AmazonCognitoIdentity.CognitoUserSession) => {
  return Promise.all([
    getUserMeta(session),
    listTeams(session)
    /*more API loads here*/
  ]).then(([userMeta, teams]) => ({
    teams,
    userMeta
  }));
};

export class AuthContainer extends React.Component<Props, State> {
  async componentDidMount() {
    const session = await getSession();

    if (session === null) {
      return this.props.ready();
    }

    try {
      const { userMeta, teams } = await (delay(
        APILoads(session),
        500
      ) as Promise<APIResult>);
      this.props.setSession(session);
      this.props.setUserMeta(userMeta);
      this.props.setTeams(Array.isArray(teams) ? teams : []);
      const { language } = userMeta;
      const localeData = loadLocale(language);
      if (localeData) {
        setLocaleData(localeData);
      }
    } catch (error) {
      console.error(error);
      this.props.serverTrouble();
    } finally {
      this.props.ready();
    }
  }

  render() {
    const { children } = this.props;
    return <>{children}</>;
  }
}

const mapStateToProps = (state: AppState) => ({
  session: state.authSupport.session
});

const mapDispatchToProps = (dispatch: Redux.Dispatch) => ({
  setSession: (session: AmazonCognitoIdentity.CognitoUserSession) =>
    dispatch(createAuthSupportActions.setSession(session)),
  setAccessToken: (accessToken: string) =>
    dispatch(createAuthSupportActions.setAccessToken(accessToken)),
  serverTrouble: () => dispatch(createAuthSupportActions.encounterTrouble()),
  ready: () => dispatch(createAuthSupportActions.ready()),
  setUserMeta: (userMeta: UserMetaState) =>
    dispatch(createUserMetaActions.setUserMeta(userMeta)),
  setTeams: (teams: Team[]) => dispatch(createTeamActions.set(teams))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthContainer);
