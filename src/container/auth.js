import React from "react";
import PropTypes from "prop-types";
import { Auth } from "aws-amplify";
import createKey from "../api/create-key";
import listKeys from "../api/list-keys";
import updateKey from "../api/update-key";
import deleteKey from "../api/delete-key";

export class AuthContainer extends React.Component {
  /**
   * propTypes
   * @type {object}
   */
  static propTypes = {
    Root: PropTypes.func.isRequired
  };

  state = { userData: void 0, display: true };

  /**
   * componentDidMount
   * @return {void}
   */
  async componentDidMount() {
    let userData = void 0;
    let isExpired = false;
    try {
      userData = await Auth.currentAuthenticatedUser();
      const expiredAt = userData.signInUserSession.idToken.payload.exp * 1000;
      const now = Date.now();
      isExpired = expiredAt <= now;
    } catch (variable) {
      userData = void 0;
    }

    if (userData && !isExpired) {
      const { successed } = await this._refreshToken(userData);
      if (successed) {
        this.setState({ userData });
      }
    }
  }

  _refreshToken = async userData => {
    try {
      const currentSession = await Auth.currentSession();
      return new Promise((resolve, reject) =>
        userData.refreshSession(currentSession.refreshToken, (err, session) => {
          if (err) {
            reject(err);
          } else {
            resolve({ successed: true });
          }
        })
      );
    } catch (e) {
      return { successed: false };
    }
  };

  signUp = (username, email, password) => {
    const param = { username, password, attributes: { email } };
    return Auth.signUp(param).then(userData => ({ successed: true }));
  };

  verify = (username, code) =>
    Auth.confirmSignUp(username, code).then(result => {
      if ("SUCCESS" === result) {
        return { successed: true };
      } else {
        throw new Error({ code: "UNKNOWN" });
      }
    });

  signin = (email, password) =>
    Auth.signIn(email, password).then(userData => {
      this.setState({ userData });
      return { successed: true };
    });

  resend = () => {
    const { username } = this.state.userData.user;
    return Auth.resendSignUp(username);
  };

  requestResetCode = email => Auth.forgotPassword(email);

  resetPassword = (email, code, password) => {
    return Auth.forgotPasswordSubmit(email, code, password)
      .then(data => {
        Auth.signOut();
        this.setState({ userData: void 0 });
        return { successed: true };
      })
      .catch(console.error);
  };

  signout = () => {
    Auth.signOut();
    this.setState({ userData: void 0 });
  };

  mapAuthProps = () => {
    const {
      _refreshToken,
      removeError,
      signUp,
      setUserData,
      verify,
      resend,
      signin,
      signout,
      requestResetCode,
      resetPassword
    } = this;
    const { userData, error } = this.state;
    const token = userData
      ? userData.signInUserSession.idToken.jwtToken
      : void 0;

    return {
      // authentication data
      userData,
      error,
      // methods
      removeError,
      signUp,
      setUserData,
      verify,
      resend,
      signin,
      signout,
      requestResetCode,
      resetPassword,
      // API
      API: {
        createKey: (...params) =>
          _refreshToken(userData).then(() => createKey(token)(...params)),
        listKeys: (...params) =>
          _refreshToken(userData).then(() => listKeys(token)(...params)),
        updateKey: (...params) =>
          _refreshToken(userData).then(() => updateKey(token)(...params)),
        deleteKey: (...params) =>
          _refreshToken(userData).then(() => deleteKey(token)(...params))
      }
    };
  };

  /**
   * render
   * @return {ReactElement|null|false} render a React element.
   */
  render() {
    const { display } = this.state;

    const { Root } = this.props;
    return display && <Root auth={this.mapAuthProps()} />;
  }
}

export default AuthContainer;
