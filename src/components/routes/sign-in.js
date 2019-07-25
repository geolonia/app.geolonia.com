import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import qs from "querystring";
import getErrorMessage from "../../assets/errors";
import { isValidUsername, isValidEmail } from "../../lib/validation";
import Logo from "../logo";
import ValidationMessage from "../validation-message";
import Spinner from "../spinner";
import { __ } from "@wordpress/i18n";

export class SignInRoute extends React.PureComponent {
  /**
   * propTypes
   * @type {object}
   */
  static propTypes = {
    auth: PropTypes.shape({
      signin: PropTypes.func.isRequired,
      userHasRetrieved: PropTypes.bool.isRequired,
      userData: PropTypes.any
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
      location: PropTypes.shape({
        search: PropTypes.string
      })
    }).isRequired
  };

  /**
   * constructor
   * @param  {object} props React props.
   * @return {void}
   */
  constructor(props) {
    super(props);
    const parsed = qs.parse(props.history.location.search.replace(/^\?/, ""));
    this.state = {
      verified: "true" === parsed.verified,
      reset: "true" === parsed.reset,
      emailOrUsername: decodeURIComponent(parsed.username || ""), // should be username or email
      password: "",
      onceUsernameOrEmailBlurred: false,
      error: false,
      requesting: false
    };
  }

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
        this.props.history.push(`/app/maps`);
      }
    }
  }

  _onChange = (key, value) => this.setState({ [key]: value, error: false });
  onEmailOrUsernameChange = e =>
    this._onChange("emailOrUsername", e.target.value);
  onPasswordChange = e => this._onChange("password", e.target.value);
  onEmailOrUsernameBlur = () =>
    this.state.onceUsernameOrEmailBlurred ||
    this.setState({ onceUsernameOrEmailBlurred: true });

  onSigninClick = () => {
    this.setState({ requesting: true, error: false });
    this.props.auth
      .signin(this.state.emailOrUsername, this.state.password)
      .then(({ successed }) => {
        this.setState({ requesting: false });
        successed && this.props.history.push(`/app/maps`);
      })
      .catch(error => this.setState({ requesting: false, error }));
  };

  render() {
    const {
      verified,
      reset,
      emailOrUsername,
      password,
      onceUsernameOrEmailBlurred,
      error,
      requesting
    } = this.state;
    const isValidEmailOrUsername =
      emailOrUsername === "" ||
      isValidUsername(emailOrUsername) ||
      isValidEmail(emailOrUsername);

    return (
      <main
        className={
          "geolonia-app uk-container uk-container-xsmall uk-margin uk-padding"
        }
      >
        <Logo />
        {verified && (
          <div uk-alert={"true"} className={"uk-alert-success"}>
            <p className={"uk-padding"}>
              {__(
                "Congratulations! Your email and account have been successfully verified!",
                "geolonia-dashboard"
              )}
              <br />
              {__(
                "Please reenter password to sign in and enjoy TileCloud!",
                "geolonia-dashboard"
              )}
            </p>
          </div>
        )}
        {reset && (
          <div uk-alert={"true"} className={"uk-alert-primary"}>
            <p className={"uk-padding"}>
              {__(
                "Your password has been reset successfully.",
                "geolonia-dashboard"
              )}
              <br />
              {__(
                "Please sign in to continue TileCloud.",
                "geolonia-dashboard"
              )}
            </p>
          </div>
        )}
        <h3 className={"uk-card-title"}>
          {__("sign in", "geolonia-dashboard")}
        </h3>

        <form action={""} className={"uk-form-horizontal"}>
          <div className={"uk-margin"}>
            <label className={"uk-form-label"} htmlFor={"email"}>
              {__("email or user name", "geolonia-dashboard")}
            </label>
            <div className={"uk-form-controls"}>
              <input
                className={
                  "uk-input" +
                  (onceUsernameOrEmailBlurred && !isValidEmailOrUsername
                    ? " uk-form-danger"
                    : "")
                }
                id={"email"}
                type={"text"}
                value={emailOrUsername}
                onChange={this.onEmailOrUsernameChange}
                onBlur={this.onEmailOrUsernameBlur}
                placeholder={__(
                  "name@example.com or username",
                  "geolonia-dashboard"
                )}
              />
              <ValidationMessage
                display={onceUsernameOrEmailBlurred && !isValidEmailOrUsername}
                text={__(
                  "Please enter valid email or username (only A-Z, a-z, 0-9, - and _ are available).",
                  "geolonia-dashboard"
                )}
              />
            </div>
          </div>

          <div className={"uk-margin"}>
            <label className={"uk-form-label"} htmlFor={"password"}>
              {__("password", "geolonia-dashboard")}
            </label>
            <div className={"uk-form-controls"}>
              <input
                className={"uk-input"}
                id={"password"}
                type={"password"}
                value={password}
                onChange={this.onPasswordChange}
                onBlur={this.onPasswordBlur}
              />
            </div>
          </div>

          <div className={"uk-margin uk-flex uk-flex-right"}>
            <div className={"uk-flex uk-flex-column"}>
              <button
                className={"uk-button uk-button-default"}
                type={"button"}
                onClick={this.onSigninClick}
                disabled={
                  requesting ||
                  !emailOrUsername ||
                  !password ||
                  !isValidEmailOrUsername
                }
              >
                <Spinner loading={requesting} />
                {__("sign in", "geolonia-dashboard")}
              </button>
            </div>
          </div>
          {error && (
            <div className={"uk-margin uk-flex uk-flex-right"}>
              <div className={"uk-flex uk-flex-column"}>
                <span className={"uk-text-warning"}>
                  {getErrorMessage(error, "signin")}
                </span>
              </div>
            </div>
          )}
          <div className={"uk-margin uk-flex uk-flex-right"}>
            <div className={"uk-flex uk-flex-column"}>
              <Link to={"/app/sign-up"}>
                {__("Create an account.", "geolonia-dashboard")}
              </Link>
              <Link to={"/app/reset_password"}>
                {__("I forgot my password.", "geolonia-dashboard")}
              </Link>
            </div>
          </div>
        </form>
      </main>
    );
  }
}

export default SignInRoute;
