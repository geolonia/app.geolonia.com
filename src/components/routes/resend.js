import React from "react";
import PropTypes from "prop-types";
import { isValidEmail } from "../../lib/validation";
import ValidationMessage from "../validation-message";
import getErrorMessage from "../../assets/errors";
import Spinner from "../spinner";
import { __ } from "@wordpress/i18n";

export class ResendCodeRoute extends React.PureComponent {
  /**
   * propTypes
   * @type {object}
   */
  static propTypes = {
    auth: PropTypes.shape({
      userData: PropTypes.any,
      resend: PropTypes.func.isRequired,
      userHasRetrieved: PropTypes.bool.isRequired
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    })
  };

  state = {
    email: "",
    onceEmailBlurred: false,
    error: false,
    requesting: false
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
        this.props.history.push(`/app/maps`);
      }
    }
  }

  _onChange = (key, value) => this.setState({ [key]: value, error: false });
  onEmailChange = e => this._onChange("email", e.target.value);
  onEmailBlur = () =>
    this.state.onceEmailBlurred || this.setState({ onceEmailBlurred: true });

  onResendClick = () => {
    this.setState({ requesting: true, error: false });
    const email =
      (this.props.auth.userData && this.props.auth.userData.user.username) ||
      this.state.email;
    this.props.auth
      .resend(email)
      .then(({ successed }) => {
        this.setState({ requesting: false });
        successed && this.props.history.push(`/app/verify`);
      })
      .catch(error => this.setState({ requesting: false, error }));
  };

  render() {
    const { email, onceEmailBlurred, error, requesting } = this.state;
    const isEmailValid = email === "" || isValidEmail(email);

    return (
      <main
        className={
          "geolonia-app uk-container uk-container-xsmall uk-margin uk-padding"
        }
      >
        <h3 className={"uk-card-title uk-text-capitalize"}>
          {__("resend a verification code", "geolonia-dashboard")}
        </h3>
        <form className={"uk-form-horizontal"} action={""}>
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
                placeholder={"user@example.com"}
              />
              <ValidationMessage
                display={!isEmailValid}
                text={__("Please enter a valid email.", "geolonia-dashboard")}
              />
            </div>
          </div>

          <div className={"uk-margin uk-flex uk-flex-right"}>
            <div className={"uk-flex uk-flex-column"}>
              <button
                className={"uk-button uk-button-default"}
                type={"button"}
                onClick={this.onResendClick}
                disabled={requesting || !email || !isEmailValid}
              >
                <Spinner loading={requesting} />
                {__("resend", "geolonia-dashboard")}
              </button>
            </div>
          </div>
          {error && (
            <div className={"uk-margin uk-flex uk-flex-right"}>
              <div className={"uk-flex uk-flex-column"}>
                <span className={"uk-text-warning"}>
                  {getErrorMessage(error, "resend")}
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
