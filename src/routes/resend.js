import React from "react";
import PropTypes from "prop-types";
import { isValidEmail } from "../lib/validation";

export class ResendCodeRoute extends React.PureComponent {
  /**
   * propTypes
   * @type {object}
   */
  static propTypes = {
    auth: PropTypes.shape({
      resend: PropTypes.func.isRequired
    }).isRequired
  };

  state = {
    email: "",
    error: void 0
  };

  _onChange = (key, value) => this.setState({ [key]: value, error: void 0 });
  onEmailChange = e => this._onChange("email", e.target.value);

  onResendClick = () => {
    console.log(this.props.auth.userData);
    const email =
      (this.props.auth.userData && this.props.auth.userData.user.username) ||
      this.state.email;
    this.props.auth
      .resend(email)
      .then(({ successed }) => successed && this.props.history.push("/verify/"))
      .catch(error => this.setState({ error }));
  };

  render() {
    const { email, error } = this.state;
    const isEmailValid = email === "" || isValidEmail(email);

    return (
      <main
        className={
          "uk-container uk-container-xsmall uk-margin uk-padding-small"
        }
      >
        <h3 className={"uk-card-title"}>
          {"Request Resend Verification Code"}
        </h3>
        <form className={"uk-form-horizontal"} action={""}>
          <div className={"uk-margin"}>
            <label className={"uk-form-label"} htmlFor={"email"}>
              {"email"}
            </label>
            <div className={"uk-form-controls"}>
              <input
                className={"uk-input" + (isEmailValid ? "" : " uk-form-danger")}
                id={"email"}
                type={"email"}
                value={email}
                onChange={this.onEmailChange}
                placeholder={"user@example.com"}
              />
              {isEmailValid || (
                <div className={"uk-text-right"}>
                  <span className={"uk-text-danger"}>
                    {"Please enter valid email."}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className={"uk-margin uk-flex uk-flex-right"}>
            <div className={"uk-flex uk-flex-column"}>
              <button
                className={"uk-button uk-button-default"}
                type={"button"}
                onClick={this.onResendClick}
                disabled={!email || !isEmailValid}
              >
                {"resend"}
              </button>
            </div>
          </div>
          {error && (
            <div className={"uk-margin uk-flex uk-flex-right"}>
              <div className={"uk-flex uk-flex-column"}>
                <span className={"uk-text-warning"}>
                  {error.message || "不明なエラーです"}
                </span>
              </div>
            </div>
          )}
        </form>
      </main>
    );
  }
}

export default ResendCodeRoute;
