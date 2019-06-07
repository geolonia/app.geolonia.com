import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import queryString from "query-string";
import getErrorMessage from "../assets/errors";

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
      verified: "true" === parsed.verified,
      reset: "true" === parsed.reset,
      email: parsed.username || "",
      password: "",
      error: void 0
    };
  }

  _onChange = (key, value) => this.setState({ [key]: value, error: void 0 });
  onEmailChange = e => this._onChange("email", e.target.value);
  onPasswordChange = e => this._onChange("password", e.target.value);
  onSigninClick = () => {
    this.props.auth
      .signin(this.state.email, this.state.password)
      .then(
        ({ successed }) => successed && this.props.history.push("/dashboard/")
      )
      .catch(error => this.setState({ error }));
  };

  render() {
    const { verified, reset, email, password, error } = this.state;

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
                className={"uk-input"}
                id={"email"}
                type={"text"}
                value={email}
                onChange={this.onEmailChange}
                placeholder={"username or name@example.com"}
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
                onClick={this.onSigninClick}
                disabled={!email || !password}
              >
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
