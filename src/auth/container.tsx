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

export class AuthContainer extends React.Component<Props, State> {
  componentDidMount() {
    delay(getSession() /*API access*/, 500)
      .then(({ session, accessToken }) => {
        this.props.setSession(session);
        this.props.setAccessToken(accessToken);
        return this.getUserMeta(session);
      })
      .catch(err => console.error(err))
      .finally(this.props.ready);
  }

  getUserMeta = (session: AmazonCognitoIdentity.CognitoUserSession) => {
    return getUserMeta(session).then(({ item, links }) => {
      this.props.setUserMeta({ ...item, links } || initialUserMetaState);
    }).finally(() => {
      const localeData = loadLocale();
      console.log(localeData)
      if (localeData) {
        setLocaleData(localeData);
      }
    })
  };

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
