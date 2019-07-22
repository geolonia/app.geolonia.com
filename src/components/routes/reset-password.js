import React from "react";
import PropTypes from "prop-types";
import {
  isValidCode,
  isValidEmail,
  isValidPassword
} from "../../lib/validation";
import ValidationMessage from "../validation-message";
import getErrorMessage from "../../assets/errors";
import Spinner from "../spinner";
import { __ } from "@wordpress/i18n";
import Logo from "../logo";
import queryString from "query-string";

export class ResetPasswordRoute extends React.PureComponent {
  /**
   * propTypes
   * @type {object}
   */
  static propTypes = {
    auth: PropTypes.shape({
      requestResetCode: PropTypes.func.isRequired,
      resetPassword: PropTypes.func.isRequired
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
      location: PropTypes.shape({
        search: PropTypes.string
      }).isRequired
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
      email: parsed.email || "",
      code: "",
      password: "",
      onceEmailBlurred: false,
      onceCodeBlurred: false,
      oncePasswordBlurred: false,
      requesting: false,
      requested: false,
      error: void 0
    };
  }

  _onChange = (key, value) => this.setState({ [key]: value, error: void 0 });
  onEmailChange = e => this._onChange("email", e.target.value);
  onCodeChange = e => this._onChange("code", e.target.value);
  onPasswordChange = e => this._onChange("password", e.target.value);
  onEmailBlur = () =>
    this.state.onceEmailBlurred || this.setState({ onceEmailBlurred: true });
  onCodeBlur = () =>
    this.state.onceCodeBlurred || this.setState({ onceCodeBlurred: true });
  onPasswordBlur = () =>
    this.state.oncePasswordBlurred ||
    this.setState({ oncePasswordBlurred: true });

  onRequestClick = () => {
    this.setState({ requesting: true, error: false });
    const { email } = this.state;
    this.props.auth
      .requestResetCode(email)
      .then(() => this.setState({ requesting: false, requested: true }))
      .catch(
        error =>
          console.log(error) || this.setState({ requesting: false, error })
      );
  };

  onResetClick = () => {
    this.setState({ requesting: true, error: false });
    const { email, code, password } = this.state;
    this.props.auth
      .resetPassword(email, code, password)
      .then(({ successed }) => {
        this.setState({ requesting: false });
        if (successed) {
          this.props.history.push(`/app/sign-in?reset=true&username=${email}`);
        }
      })
      .catch(error => this.setState({ requesting: false, error }));
  };

  render() {
    const {
      error,
      email,
      code,
      password,
      onceEmailBlurred,
      onceCodeBlurred,
      oncePasswordBlurred,
      requested,
      requesting
    } = this.state;
    const isCodeValid = code === "" || isValidCode(code);
    const isEmailValid = email === "" || isValidEmail(email);
    const isPasswordValid = password === "" || isValidPassword(password);

    return (
      <main
        className={
          "geolonia-app uk-container uk-container-xsmall uk-margin uk-padding-small"
        }
      >
        <Logo />
        <h3 className={"uk-card-title uk-text-capitalize"}>
          {__("reset password", "geolonia-dashboard")}
        </h3>

        <p>{__("Please verify your email address.", "geolonia-dashboard")}</p>

        <form className={"uk-form-horizontal"} action={""}>
          <div className={"uk-margin"}>
            <label className={"uk-form-label"} htmlFor={"email"}>
              {__("email", "geolonia-dashboard")}
            </label>
            <div className={"uk-form-controls"}>
              <input
                disabled={requested}
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
                text={__("Please enter a valid email.", "geolonia-dashboard")}
              />
            </div>
          </div>

          <div className={"uk-margin uk-flex uk-flex-right"}>
            <div className={"uk-flex uk-flex-column"}>
              <button
                className={"uk-button uk-button-default"}
                type={"button"}
                onClick={this.onRequestClick}
                disabled={requesting || !email || !isEmailValid || requested}
              >
                <Spinner loading={requesting} />
                {__("send a verification code via email", "geolonia-dashboard")}
              </button>
            </div>
          </div>

          {requested && (
            <div uk-alert={"true"} className={"uk-alert-success"}>
              <p className={"uk-padding"}>
                {__(
                  "We have sent a verification code via email.",
                  "geolonia-dashboard"
                )}
                <br />
                {__(
                  "Please enter the verification code to reset password.",
                  "geolonia-dashboard"
                )}
              </p>
            </div>
          )}

          {requested && (
            <div className={"uk-margin"}>
              <label className={"uk-form-label"} htmlFor={"code"}>
                {__("code", "geolonia-dashboard")}
              </label>
              <div className={"uk-form-controls"}>
                <input
                  className={
                    "uk-input" +
                    (onceCodeBlurred && !isCodeValid ? " uk-form-danger" : "")
                  }
                  id={"code"}
                  type={"text"}
                  value={code}
                  onChange={this.onCodeChange}
                  onBlur={this.onCodeBlur}
                  placeholder={"012345"}
                />
                <ValidationMessage
                  display={onceCodeBlurred && !isCodeValid}
                  text={__(
                    "The code should like as 012345.",
                    "geolonia-dashboard"
                  )}
                />
              </div>
            </div>
          )}

          {requested && (
            <div className={"uk-margin"}>
              <label className={"uk-form-label"} htmlFor={"password"}>
                {__("new password", "geolonia-dashboard")}
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
          )}

          {requested && (
            <div className={"uk-margin uk-flex uk-flex-right"}>
              <div className={"uk-flex uk-flex-column"}>
                <button
                  className={"uk-button uk-button-default"}
                  type={"button"}
                  onClick={this.onResetClick}
                  disabled={
                    requesting ||
                    !code ||
                    !password ||
                    !isCodeValid ||
                    !isPasswordValid
                  }
                >
                  <Spinner loading={requesting} />
                  {__("reset password", "geolonia-dashboard")}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className={"uk-margin uk-flex uk-flex-right"}>
              <div className={"uk-flex uk-flex-column"}>
                <span className={"uk-text-warning"}>
                  {getErrorMessage(error, "reset-password")}
                </span>
              </div>
            </div>
          )}
        </form>
      </main>
    );
  }
}

export default ResetPasswordRoute;
