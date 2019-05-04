import React from "react";
import PropTypes from "prop-types";

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

  state = {
    email: "",
    password: "",
    error: void 0
  };

  _onChange = (key, value) => this.setState({ [key]: value, error: void 0 });
  onEmailChange = e => this._onChange("email", e.target.value);
  onPasswordChange = e => this._onChange("password", e.target.value);
  onSigninClick = () => {
    this.props.auth
      .signin(this.state.email, this.state.password)
      .then(user => {
        this.props.history.push("/dashboard/");
      })
      .catch(error => this.setState({ error }));
  };

  render() {
    const { email, password, error } = this.state;

    return (
      <main className={"uk-margin uk-padding-small"}>
        <h3 className="uk-card-title">{"sign in"}</h3>

        <form className="uk-form-horizontal" action={"#"}>
          <div className="uk-margin">
            <label className="uk-form-label" htmlFor="email">
              {"email"}
            </label>
            <div className="uk-form-controls">
              <input
                className="uk-input"
                id="email"
                type="email"
                value={email}
                onChange={this.onEmailChange}
                placeholder="name@example.com"
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
              >
                {"sign in"}
              </button>
              <span className={"uk-text-warning"}>
                {error ? error.code : null}
              </span>
            </div>
          </div>
        </form>
      </main>
    );
  }
}

export default SignInRoute;
