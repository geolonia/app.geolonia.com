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

  /**
   * constructor
   * @param  {object} props React props.
   * @return {void}
   */
  constructor(props) {
    super(props);
    let userData = void 0;
    try {
      userData = JSON.parse(localStorage.getItem("tilecloud_user")) || void 0;
    } catch (e) {
      userData = void 0;
    }
    this.state = { userData, display: true };
  }

  _setUserData = userData => {
    localStorage.setItem("tilecloud_user", JSON.stringify(userData));
    this.setState({ userData });
  };

  signUp = (username, email, password) => {
    const param = { username, password, attributes: { email } };
    return Auth.signUp(param).then(userData => ({ successed: true }));
  };

  verify = (username, code) =>
    Auth.confirmSignUp(username, code).then(result => {
      if (result === "SUCCESS") {
        return { successed: true };
      } else {
        throw new Error({ code: "UNKNOWN" });
      }
    });

  signin = (email, password) =>
    Auth.signIn(email, password).then(userData => {
      this._setUserData(userData);
      return { success: true };
    });

  resend = () => {
    const { username } = this.state.userData.user;
    return Auth.resendSignUp(username);
  };

  requestResetCode = email => Auth.forgotPassword(email);
  resetPassword = (email, code, password) =>
    Auth.forgotPasswordSubmit(email, code, password);

  signout = () => {
    localStorage.clear();
    this.setState({ userData: void 0 });
  };

  mapAuthProps = () => {
    const {
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
        createKey: createKey(token),
        listKeys: listKeys(token),
        updateKey: updateKey(token),
        deleteKey: deleteKey(token)
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
