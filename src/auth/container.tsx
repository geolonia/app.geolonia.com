import React from "react";

// i18n
import { loadLocale } from "../lib/loadLocale";
import { setLocaleData } from "@wordpress/i18n";

// API
import { getSession } from "./";
import getUserMeta from "../api/users/get";
import getGroups from "../api/groups/get";

// Utils
import delay from "../lib/promise-delay";

// redux
import { connect } from "react-redux";
import { createActions as createAuthSupportActions } from "../redux/actions/auth-support";
import { createActions as createUserMetaActions } from "../redux/actions/user-meta";
import { createActions as createGroupActions } from "../redux/actions/group";
import Redux from "redux";

// Types
import { UserMetaState } from "../redux/actions/user-meta";
import { AppState } from "../redux/store";
import { Group } from "../redux/actions/group";
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";

type Props = {
  session?: AmazonCognitoIdentity.CognitoUserSession;
  setSession: (session: AmazonCognitoIdentity.CognitoUserSession) => void;
  setAccessToken: (accessToken: string) => void;
  ready: () => void;
  setUserMeta: (userMeta: UserMetaState) => void;
  setGroups: (groups: Group[]) => void;
};

type State = {};

const APILoads = () => {
  return getSession().then(session => {
    if (session === null) {
      throw new Error("no session found");
    }
    return Promise.all([
      getUserMeta(session),
      getGroups(session)
      /*more API loads here*/
    ]).then(([userMeta, groups]) => ({
      session,
      groups,
      userMeta
    }));
  });
};

export class AuthContainer extends React.Component<Props, State> {
  componentDidMount() {
    delay(APILoads(), 500)
      .then(({ session, userMeta, groups }) => {
        const { item, links } = userMeta;
        this.props.setSession(session);
        this.props.setUserMeta({ ...item, links });
        this.props.setGroups(groups);
      })
      .catch(err => console.error(err))
      .finally(() => {
        const localeData = loadLocale();
        if (localeData) {
          setLocaleData(localeData);
        }
        this.props.ready();
      });
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
  ready: () => dispatch(createAuthSupportActions.ready()),
  setUserMeta: (userMeta: UserMetaState) =>
    dispatch(createUserMetaActions.setUserMeta(userMeta)),
  setGroups: (groups: Group[]) => dispatch(createGroupActions.set(groups))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthContainer);
