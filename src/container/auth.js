import React from "react";
import PropTypes from "prop-types";
import { Auth } from "aws-amplify";

export class AuthContainer extends React.Component {
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
    // Auth.currentAuthenticatedUser()
  }

  /**
   * sign up with email
   * @param  {string} email    [description]
   * @param  {string} password [description]
   * @return {Promise}          [description]
   */
  signup = (email, password) => Auth.signUp(email, password);

  verify = (username, code) =>
    Auth.confirmSignUp(username, code).then(data => {
      if (data === "SUCCESS") {
        const nextUserData = { ...this.state.userData, userConfirmed: true };
        localStorage.setItem("tilecloud_user", JSON.stringify(nextUserData));
        this.setState({ userData: nextUserData });
      }
    });

  resend = () => {
    const { username } = this.state.userData.user;
    return Auth.resendSignUp(username);
  };

  setUserData = userData => {
    localStorage.setItem("tilecloud_user", JSON.stringify(userData));
    this.setState({ userData });
  };

  /**
   * sign in with email
   * @param  {string} email    [description]
   * @param  {string} password [description]
   * @return {Promise}          [description]
   */
  signin = (email, password) =>
    Auth.signIn(email, password).then(user => {
      const userData = { user, userConfirmed: user.attributes.email_verified };
      localStorage.setItem("tilecloud_user", JSON.stringify(userData));
      this.setState({ userData });
    });

  requestResetCode = email => Auth.forgotPassword(email);
  resetPassword = (email, code, password) =>
    Auth.forgotPasswordSubmit(email, code, password);

  /**
   * sign out
   * @return {Promise} [description]
   */
  signout = () => {
    localStorage.removeItem("tilecloud_user");
    this.setState({ userData: void 0 });
  };

  /**
   * render
   * @return {ReactElement|null|false} render a React element.
   */
  render() {
    const { userData, display } = this.state;
    const {
      signup,
      setUserData,
      verify,
      resend,
      signin,
      signout,
      requestResetCode,
      resetPassword
    } = this;
    const { Root } = this.props;
    return (
      display && (
        <Root
          auth={{
            userData,
            signup,
            setUserData,
            verify,
            resend,
            signin,
            signout,
            requestResetCode,
            resetPassword
          }}
        />
      )
    );
  }
}

AuthContainer.propTypes = {
  Root: PropTypes.func.isRequired
};
export default AuthContainer;
