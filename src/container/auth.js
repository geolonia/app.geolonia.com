import React from "react";
import firebase from "../config/firebase";
import PropTypes from "prop-types";

export class AuthContainer extends React.Component {
  /**
   * constructor
   * @param  {object} props React props.
   * @return {void}
   */
  constructor(props) {
    super(props);
    this.state = { user: void 0, display: false };
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ user, display: true });
    });
  }

  /**
   * sign up with email
   * @param  {string} email    [description]
   * @param  {string} password [description]
   * @return {Promise}          [description]
   */
  signup = (email, password) =>
    firebase.auth().createUserWithEmailAndPassword(email, password);

  /**
   * sign in with email
   * @param  {string} email    [description]
   * @param  {string} password [description]
   * @return {Promise}          [description]
   */
  signin = (email, password) =>
    firebase.auth().signInWithEmailAndPassword(email, password);

  reset = email => firebase.auth().sendPasswordResetEmail(email);

  /**
   * sign out
   * @return {Promise} [description]
   */
  signout = () => firebase.auth().signOut();

  /**
   * render
   * @return {ReactElement|null|false} render a React element.
   */
  render() {
    const { user, display } = this.state;
    const { signup, signin, signout, reset } = this;
    const { Root } = this.props;
    return display && <Root auth={{ user, signup, signin, signout, reset }} />;
  }
}

AuthContainer.propTypes = {
  Root: PropTypes.func.isRequired
};
export default AuthContainer;
