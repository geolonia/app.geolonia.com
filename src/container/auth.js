import React from "react";
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
    // initialize auth here
  }

  /**
   * sign up with email
   * @param  {string} email    [description]
   * @param  {string} password [description]
   * @return {Promise}          [description]
   */
  signup = (email, password) => {};

  /**
   * sign in with email
   * @param  {string} email    [description]
   * @param  {string} password [description]
   * @return {Promise}          [description]
   */
  signin = (email, password) => {};

  reset = email => {};

  /**
   * sign out
   * @return {Promise} [description]
   */
  signout = () => {};

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
