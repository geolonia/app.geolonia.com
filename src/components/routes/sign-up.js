import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import getErrorMessage from "../../assets/errors";
import {
  isValidUsername,
  isValidEmail,
  isValidPassword
} from "../../lib/validation";
import Logo from "../logo";
import ValidationMessage from "../validation-message";
import Spinner from "../spinner";
import { __ } from "@wordpress/i18n";

export class SignUpRoute extends React.PureComponent {
  /**
   * propTypes
   * @type {object}
   */
  static propTypes = {
    auth: PropTypes.shape({
      error: PropTypes.any,
      signUp: PropTypes.func.isRequired,
      userHasRetrieved: PropTypes.bool.isRequired,
      userData: PropTypes.any
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired
  };

  state = {
    username: "",
    email: "",
    password: "",
    onceUsernameBlurred: false,
    onceEmailBlurred: false,
    oncePasswordBlurred: false,
    requesting: false,
    error: false
  };

  /**
   * componentDidUpdate
   * @param  {object} prevProps prev props
   * @param  {object} prevState prev state
   * @param  {object} snapshot  snapshot
   * @return {void}
   */
  componentDidUpdate(prevProps) {
    if (!prevProps.auth.userHasRetrieved && this.props.auth.userHasRetrieved) {
      if (this.props.auth.userData) {
        this.props.history.push(`/app/dashboard`);
      }
    }
  }

  _onChange = (key, value) => this.setState({ [key]: value, error: false });
  onUsernameChange = e => this._onChange("username", e.target.value);
  onEmailChange = e => this._onChange("email", e.target.value);
  onPasswordChange = e => this._onChange("password", e.target.value);
  onUsernameBlur = () =>
    this.state.onceUsernameBlurred ||
    this.setState({ onceUsernameBlurred: true });
  onEmailBlur = () =>
    this.state.onceEmailBlurred || this.setState({ onceEmailBlurred: true });
  onPasswordBlur = () =>
    this.state.oncePasswordBlurred ||
    this.setState({ oncePasswordBlurred: true });

  onSignupClick = () => {
    const { username, email, password } = this.state;
    this.setState({ requesting: true, error: false });
    this.props.auth
      .signUp(username, email, password)
      .then(({ successed }) => {
        this.setState({ requesting: false });
        successed &&
          this.props.history.push(`/app/verify?sent=true&username=${username}`);
      })
      .catch(error => this.setState({ error, requesting: false }));
  };

  render() {
    const {
      username,
      email,
      password,
      onceUsernameBlurred,
      onceEmailBlurred,
      oncePasswordBlurred,
      requesting,
      error
    } = this.state;

    const isUsernameValid = username === "" || isValidUsername(username);
    const isPasswordValid = password === "" || isValidPassword(password);
    const isEmailValid = email === "" || isValidEmail(email);

    return (
      <main
        className={
          "tilecloud-app uk-container uk-container-xsmall uk-margin uk-padding-small"
        }
      >
        <Logo />
        <h3 className={"uk-card-title uk-text-uppercase"}>
          {__("sign up", "geolonia-dashboard")}
        </h3>

        <form action={""} className={"uk-form-horizontal"}>
          <div className={"uk-margin"}>
            <label
              className={"uk-form-label uk-text-uppercase"}
              htmlFor={"username"}
            >
              {__("user name", "geolonia-dashboard")}
            </label>
            <div className={"uk-form-controls"}>
              <input
                className={
                  "uk-input" +
                  (onceUsernameBlurred && !isUsernameValid
                    ? " uk-form-danger"
                    : "")
                }
                id={"username"}
                type={"username"}
                value={username}
                onChange={this.onUsernameChange}
                onBlur={this.onUsernameBlur}
                placeholder={__("username", "geolonia-dashboard")}
              />
              <ValidationMessage
                display={onceUsernameBlurred && !isUsernameValid}
                text={__(
                  "You can use only A-Z, a-z, 0-9, - and _ for user name.",
                  "geolonia-dashboard"
                )}
              />
            </div>
          </div>

          <div className={"uk-margin"}>
            <label className={"uk-form-label"} htmlFor={"email"}>
              {__("email", "geolonia-dashboard")}
            </label>
            <div className={"uk-form-controls"}>
              <input
                className={
                  "uk-input" +
                  (onceEmailBlurred && !isEmailValid ? " uk-form-danger" : "")
                }
                id={"email"}
                type={"email"}
                value={email}
                onChange={this.onEmailChange}
                onBlur={this.onEmailBlur}
                placeholder={"name@example.com"}
              />
              <ValidationMessage
                display={onceEmailBlurred && !isEmailValid}
                text={__("Please enter correct email.", "geolonia-dashboard")}
              />
            </div>
          </div>

          <div className={"uk-margin"}>
            <label className={"uk-form-label"} htmlFor={"password"}>
              {__("password", "geolonia-dashboard")}
            </label>
            <div className={"uk-form-controls"}>
              <input
                className={
                  "uk-input" +
                  (oncePasswordBlurred && !isPasswordValid
                    ? " uk-form-danger"
                    : "")
                }
                id={"password"}
                type={"password"}
                value={password}
                onChange={this.onPasswordChange}
                onBlur={this.onPasswordBlur}
              />
              <ValidationMessage
                display={oncePasswordBlurred && !isPasswordValid}
                text={__(
                  "Number of password characters should be 8 at least.",
                  "geolonia-dashboard"
                )}
              />
            </div>
          </div>

          <div className={"uk-margin uk-flex uk-flex-right"}>
            <div className={"uk-flex uk-flex-column"}>
              <button
                className={"uk-button uk-button-default"}
                type={"button"}
                onClick={this.onSignupClick}
                disabled={
                  requesting ||
                  !username ||
                  !email ||
                  !password ||
                  !isUsernameValid ||
                  !isEmailValid ||
                  !isPasswordValid
                }
              >
                <Spinner loading={requesting} />
                {__("sign up", "geolonia-dashboard")}
              </button>
            </div>
          </div>
          {error && (
            <div className={"uk-margin uk-flex uk-flex-right"}>
              <div className={"uk-flex uk-flex-column"}>
                <span className={"uk-text-warning"}>
                  {getErrorMessage(error, "signup")}
                </span>
              </div>
            </div>
          )}
          <div className={"uk-margin uk-flex uk-flex-right"}>
            <div className={"uk-flex uk-flex-column"}>
              <Link to={"/app/sign-in"}>
                {__("Sign in with an existing account.", "geolonia-dashboard")}
              </Link>

              <Link to={"/app/verify"}>
                {__(
                  "I already have a verification code.",
                  "geolonia-dashboard"
                )}
              </Link>
            </div>
          </div>
        </form>
      </main>
    );
  }
}

export default SignUpRoute;
