import React from "react";
import { getSession } from "./";
import getUserMeta from "../api/users/get";
import { connect } from "react-redux";
import { createActions as createAuthSupportActions } from "../redux/actions/auth-support";
import { createActions as createUserMetaActions } from "../redux/actions/user-meta";
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";
import Redux from "redux";
import { AppState } from "../redux/store";
import delay from "../lib/promise-delay";
import { UserMetaState } from "../redux/actions/user-meta";
import { initialState as initialUserMetaState } from "../redux/actions/user-meta";
import { setLocaleData } from "@wordpress/i18n";
import { loadLocale } from "../lib/loadLocale";

type Props = {
  session?: AmazonCognitoIdentity.CognitoUserSession;
  setSession: (session: AmazonCognitoIdentity.CognitoUserSession) => void;
  setAccessToken: (accessToken: string) => void;
  ready: () => void;
  setUserMeta: (userMeta: UserMetaState) => void;
};

type State = {};

const APILoads = () => {
  return getSession().then(session => {
    if (session === null) {
      throw new Error("no session found");
    }
    return Promise.all([
      getUserMeta(session)
      /*more API loads here*/
    ]).then(([userMeta]) => ({
      session,
      userMeta
    }));
  });
};

export class AuthContainer extends React.Component<Props, State> {
  componentDidMount() {
    delay(APILoads(), 500)
      .then(({ session, userMeta }) => {
        const { item, links } = userMeta;
        this.props.setSession(session);
        this.props.setUserMeta({ ...item, links });
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
    dispatch(createUserMetaActions.setUserMeta(userMeta))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthContainer);
