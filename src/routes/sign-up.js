import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import getErrorMessage from "../assets/errors";

export class SignUpRoute extends React.PureComponent {
  /**
   * propTypes
   * @type {object}
   */
  static propTypes = {
    auth: PropTypes.shape({
      error: PropTypes.any,
      signUp: PropTypes.func.isRequired
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired
  };

  state = {
    username: "",
    email: "",
    password: "",
    requesting: false,
    error: false
  };

  _onChange = (key, value) => this.setState({ [key]: value, error: false });
  onUsernameChange = e => this._onChange("username", e.target.value);
  onEmailChange = e => this._onChange("email", e.target.value);
  onPasswordChange = e => this._onChange("password", e.target.value);

  onSignupClick = () => {
    const { username, email, password } = this.state;
    this.setState({ requesting: true });
    this.props.auth
      .signUp(username, email, password)
      .then(
        ({ successed }) =>
          successed &&
          this.props.history.push(`/verify?sent=true&username=${username}`)
      )
      .catch(error => this.setState({ error, requesting: false }));
  };

  render() {
    const { username, email, password, requesting, error } = this.state;

    // TODO: Split Form modules as a Component
    const isUsernameValid = true;
    const isPasswordValid = true;
    const isEmailValid = true;

    return (
      <main
        className={
          "uk-container uk-container-xsmall uk-margin uk-padding-small"
        }
      >
        <h1 className={"uk-card-title uk-text-center"}>
          <img
            src={process.env.PUBLIC_URL + "/images/logo.png"}
            alt={"TileCloud"}
            style={{ width: 245, minWidth: "50%" }}
          />
        </h1>
        <h3 className={"uk-card-title"}>{"Sign Up"}</h3>

        <form action={""} className={"uk-form-horizontal"}>
          <div className={"uk-margin"}>
            <label className={"uk-form-label"} htmlFor={"username"}>
              {"username"}
            </label>
            <div className={"uk-form-controls"}>
              <input
                className={"uk-input"}
                id={"username"}
                type={"username"}
                value={username}
                onChange={this.onUsernameChange}
                placeholder={"username"}
              />
            </div>
          </div>

          <div className={"uk-margin"}>
            <label className={"uk-form-label"} htmlFor={"email"}>
              {"email"}
            </label>
            <div className={"uk-form-controls"}>
              <input
                className={"uk-input"}
                id={"email"}
                type={"email"}
                value={email}
                onChange={this.onEmailChange}
                placeholder={"name@example.com"}
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
                  !username ||
                  !email ||
                  !password ||
                  !isUsernameValid ||
                  !isEmailValid ||
                  !isPasswordValid
                }
              >
                {"sign up"}
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
              <Link to={"/verify/"}>{"I have a verification code."}</Link>
            </div>
          </div>
        </form>
      </main>
    );
  }
}

export default SignUpRoute;
