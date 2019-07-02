import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import queryString from "query-string";
import getErrorMessage from "../assets/errors";
import { isValidUsername, isValidEmail } from "../lib/validation";
import Logo from "../components/logo";
import ValidationMessage from "../components/validation-message";
import Spinner from "../components/spinner";

export class SignInRoute extends React.PureComponent {
  /**
   * propTypes
   * @type {object}
   */
  static propTypes = {
    auth: PropTypes.shape({
      signin: PropTypes.func.isRequired
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
    const parsed = queryString.parse(props.history.location.search);
    this.state = {
      verified: "true" === parsed.verified,
      reset: "true" === parsed.reset,
      emailOrUsername: parsed.username || "", // should be username or email
      password: "",
      onceUsernameOrEmailBlurred: false,
      error: false,
      requesting: false
    };
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
        successed && this.props.history.push(`/${__ENV__.BASE_DIR}/dashboard/`);
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
          "uk-container uk-container-xsmall uk-margin uk-padding-small"
        }
      >
        <Logo />
        {verified && (
          <div uk-alert={"true"} className={"uk-alert-success"}>
            <p className={"uk-padding"}>
              {"Congratulations! Your account have been successfully verified!"}
              <br />
              {"Please reenter password to sign in and enjoy TileCloud!"}
            </p>
          </div>
        )}
        {reset && (
          <div uk-alert={"true"} className={"uk-alert-primary"}>
            <p className={"uk-padding"}>
              {"Your password has been reset successfully."}
              <br />
              {"Please sign in to continue TileCloud."}
            </p>
          </div>
        )}
        <h3 className={"uk-card-title"}>{"Sign In"}</h3>

        <form action={""} className={"uk-form-horizontal"}>
          <div className={"uk-margin"}>
            <label className={"uk-form-label"} htmlFor={"email"}>
              {"email or username"}
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
                placeholder={"username or name@example.com"}
              />
              <ValidationMessage
                display={onceUsernameOrEmailBlurred && !isValidEmailOrUsername}
                text={
                  "Please enter valid email or username (only A-Z, a-z, 0-9, - and _ are available)."
                }
              />
            </div>
          </div>

          <div className={"uk-margin"}>
            <label className={"uk-form-label"} htmlFor={"password"}>
              {"password"}
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
                {"sign in"}
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
              <Link to={"/reset_password/"}>{"I forgot my password."}</Link>
            </div>
          </div>
        </form>
      </main>
    );
  }
}

export default SignInRoute;
