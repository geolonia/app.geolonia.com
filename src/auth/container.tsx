import React from "react";
import { getSession } from "./";
import { connect } from "react-redux";
import { createActions } from "../redux/actions/auth-support";
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";
import Redux from "redux";

type Props = {
  setSession: (session: AmazonCognitoIdentity.ICognitoUserSessionData) => void;
};

type State = {};

export class AuthContainer extends React.Component<Props, State> {
  componentDidMount() {
    console.log("aaa");
    getSession()
      .then(session => {
        const refreshToken = session.getRefreshToken();
        const accessToken = session.getAccessToken();
        console.log({ refreshToken, accessToken });
      })
      .catch(() => {
        console.log(this.props);
      });
  }

  render() {
    return <>{this.props.children}</>;
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: Redux.Dispatch) => ({
  setSession: (session: AmazonCognitoIdentity.ICognitoUserSessionData) =>
    dispatch(createActions.setSession(session))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthContainer);
