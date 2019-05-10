import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import queryString from "query-string";

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
      verified: parsed.verified === "true",
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
      .then(({ success }) => success && this.props.history.push("/dashboard/"))
      .catch(error => this.setState({ error }));
  };

  render() {
    const { verified, email, password, error } = this.state;

    return (
      <main className={"uk-margin uk-padding-small"}>
        {verified && (
          <div uk-alert class="uk-alert-success">
            <p class="uk-padding">
              {"Your account have been successfully verified!"}
            </p>
          </div>
        )}
        <h3 className="uk-card-title">{"Sign In"}</h3>

        <div className="uk-form-horizontal uk-margin">
          <label className="uk-form-label" htmlFor="email">
            {"email or username"}
          </label>
          <div className="uk-form-controls">
            <input
              className="uk-input"
              id="email"
              type="email"
              value={email}
              onChange={this.onEmailChange}
              placeholder="username or name@example.com"
            />
          </div>
        </div>

        <div className="uk-margin">
          <label className="uk-form-label" htmlFor="password">
            {"password"}
          </label>
          <div className="uk-form-controls">
            <input
              className="uk-input"
              id="password"
              type="password"
              value={password}
              onChange={this.onPasswordChange}
            />
          </div>
        </div>

        <div className="uk-margin uk-flex uk-flex-right">
          <div className="uk-flex uk-flex-column">
            <button
              className="uk-button uk-button-default"
              type={"button"}
              onClick={this.onSigninClick}
              disabled={!email || !password}
            >
              {"sign in"}
            </button>
          </div>
        </div>
        {error && (
          <div className="uk-margin uk-flex uk-flex-right">
            <div className="uk-flex uk-flex-column">
              <span className={"uk-text-warning"}>
                {error.message || "不明なエラーです。"}
              </span>
            </div>
          </div>
        )}
        <div className="uk-margin uk-flex uk-flex-right">
          <div className="uk-flex uk-flex-column">
            <Link to="/reset_password/">{"I forgot my password."}</Link>
          </div>
        </div>
      </main>
    );
  }
}

export default SignInRoute;
