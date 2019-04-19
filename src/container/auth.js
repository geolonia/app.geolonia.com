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
    this.state = { user: void 0, error: void 0 };
    firebase.auth().onAuthStateChanged(user => this.setState({ user }));
  }

  /**
   * sign up with email
   * @param  {string} email    [description]
   * @param  {string} password [description]
   * @return {Promise}          [description]
   */
  signup = (email, password) =>
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .catch(error => this.setState({ error }));

  /**
   * sign in with email
   * @param  {string} email    [description]
   * @param  {string} password [description]
   * @return {Promise}          [description]
   */
  signin = (email, password) =>
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(error => this.setState({ error }));

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
    const { user, error } = this.state;
    const { signup, signin, signout } = this;
    const { Root } = this.props;
    return <Root auth={{ user, error, signup, signin, signout }} />;
  }
}

AuthContainer.propTypes = {
  Root: PropTypes.func.isRequired
};
export default AuthContainer;
