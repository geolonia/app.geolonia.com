import React from "react";
import PropTypes from "prop-types";
import queryString from "query-string";
import { Link } from "react-router-dom";
import getErrorMessage from "../assets/errors";
import { isValidUsername, isValidCode } from "../lib/validation";
import ValidationMessage from "../components/validation-message";
import Spinner from "../components/spinner";

export class VerifyCodeRoute extends React.PureComponent {
  /**
   * propTypes
   * @type {object}
   */
  static propTypes = {
    auth: PropTypes.shape({
      verify: PropTypes.func.isRequired
    }).isRequired,
    history: PropTypes.shape({
      location: PropTypes.shape({ search: PropTypes.string }),
      push: PropTypes.func.isRequired
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
      sent: parsed.sent === "true",
      username: parsed.username || "",
      code: "",
      onceUsernameBlurred: false,
      onceCodeBlurred: false,
      error: false,
      requesting: false
    };
  }

  _onChange = (key, value) => this.setState({ [key]: value, error: false });
  onUsernameChange = e => this._onChange("username", e.target.value);
  onCodeChange = e => this._onChange("code", e.target.value);
  onUsernameBlur = () =>
    this.state.onceUsernameBlurred ||
    this.setState({ onceUsernameBlurred: true });
  onCodeBlur = () =>
    this.state.onceCodeBlurred || this.setState({ onceCodeBlurred: true });

  onVerifyClick = () => {
    this.setState({ requesting: true, error: false });
    this.props.auth
      .verify(this.state.username, this.state.code)
      .then(({ successed }) => {
        this.setState({ requesting: false });
        if (successed) {
          this.props.history.push(
            `/app/sign-in?verified=true&username=${this.state.username}`
          );
        }
      })
      .catch(error => this.setState({ requesting: false, error }));
  };

  render() {
    const {
      sent,
      username,
      code,
      onceUsernameBlurred,
      onceCodeBlurred,
      error,
      requesting
    } = this.state;
    const isUsernameValid = username === "" || isValidUsername(username);
    const isCodeValid = code === "" || isValidCode(code);
    return (
      <main
        className={
          "uk-container uk-container-xsmall uk-margin uk-padding-small"
        }
      >
        {sent && (
          <div uk-alert={"true"} className={"uk-alert-primary"}>
            <p className={"uk-padding"}>
              {
                "Please enter a verification code on the email we have been sent."
              }
            </p>
          </div>
        )}

        <h3 className={"uk-card-title"}>{"Code Verification"}</h3>
        <form action={""} className={"uk-form-horizontal"}>
          <div className={"uk-margin"}>
            <label className={"uk-form-label"} htmlFor={"username"}>
              {"username"}
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
                type={"text"}
                value={username}
                onChange={this.onUsernameChange}
                onBlur={this.onUsernameBlur}
                placeholder={"username"}
              />
              <ValidationMessage
                display={onceUsernameBlurred && !isUsernameValid}
                text={"You can use only A-Z, a-z, 0-9, - and _ for username."}
              />
            </div>
          </div>

          <div className={"uk-margin"}>
            <label className={"uk-form-label"} htmlFor={"code"}>
              {"code"}
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
                text={"Verification code should be like as 012345."}
              />
            </div>
          </div>

          <div className={"uk-margin uk-flex uk-flex-right"}>
            <div className={"uk-flex uk-flex-column"}>
              <button
                className={"uk-button uk-button-default"}
                type={"button"}
                onClick={this.onVerifyClick}
                disabled={
                  requesting ||
                  !code ||
                  !username ||
                  !isUsernameValid ||
                  !isCodeValid
                }
              >
                <Spinner loading={requesting} />
                {"verify"}
              </button>
            </div>
          </div>
          {error && (
            <div className={"uk-margin uk-flex uk-flex-right"}>
              <div className={"uk-flex uk-flex-column"}>
                <span className={"uk-text-warning"}>
                  {getErrorMessage(error, "verify")}
                </span>
              </div>
            </div>
          )}
          <div className={"uk-margin uk-flex uk-flex-right"}>
            <div className={"uk-flex uk-flex-column"}>
              <Link to={"/app/resend"}>{"I lost verification code."}</Link>
            </div>
          </div>
        </form>
      </main>
    );
  }
}

export default VerifyCodeRoute;
