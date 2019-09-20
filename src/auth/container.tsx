import React from "react";
import { getSession } from "./";
import { connect } from "react-redux";
import { createActions } from "../redux/actions/auth-support";
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";
import Redux from "redux";
import { AppState } from "../redux/store";

type Props = {
  session?: AmazonCognitoIdentity.CognitoUserSession;
  setSession: (session: AmazonCognitoIdentity.CognitoUserSession) => void;
  ready: () => void;
};

type State = {};

export class AuthContainer extends React.Component<Props, State> {
  componentDidMount() {
    getSession()
      .then(session => this.props.setSession(session))
      .catch(err => console.error(err))
      .finally(this.props.ready);
  }

  render() {
    const { children, session } = this.props;
    return <>{children}</>;
  }
}

const mapStateToProps = (state: AppState) => ({
  session: state.authSupport.session
});

const mapDispatchToProps = (dispatch: Redux.Dispatch) => ({
  setSession: (session: AmazonCognitoIdentity.CognitoUserSession) =>
    dispatch(createActions.setSession(session)),
  ready: () => dispatch(createActions.ready())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthContainer);
