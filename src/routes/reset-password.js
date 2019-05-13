import React from "react";
import PropTypes from "prop-types";

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
      push: PropTypes.func.isRequired
    }).isRequired
  };

  state = {
    email: "",
    code: "",
    password: "",
    requested: false,
    error: void 0
  };

  _onChange = (key, value) => this.setState({ [key]: value, error: void 0 });
  onEmailChange = e => this._onChange("email", e.target.value);
  onCodeChange = e => this._onChange("code", e.target.value);
  onPasswordChange = e => this._onChange("password", e.target.value);

  onRequestClick = () => {
    const { email } = this.state;
    this.props.auth
      .requestResetCode(email)
      .then(() => this.setState({ requested: true }))
      .catch(error => this.setState({ error }));
  };
  onResetClick = () => {
    const { email, code, password } = this.state;
    console.log("aaaa");
    this.props.auth
      .resetPassword(email, code, password)
      .then(({ successed }) => {
        if (successed) {
          this.props.history.push(`/sign-in?reset=true`);
        }
      })
      .catch(error => console.log({ error }) || this.setState({ error }));
  };

  render() {
    const { error, email, code, password, requested } = this.state;

    return (
      <main className={"uk-margin uk-padding-small"}>
        <h3 className="uk-card-title">{"reset password"}</h3>

        <form className="uk-form-horizontal" action="">
          <div className="uk-margin">
            <label className="uk-form-label" htmlFor="email">
              {"email"}
            </label>
            <div className="uk-form-controls">
              <input
                disabled={requested}
                className="uk-input"
                id="email"
                type="email"
                value={email}
                onChange={this.onEmailChange}
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="uk-margin uk-flex uk-flex-right">
            <div className="uk-flex uk-flex-column">
              <button
                className="uk-button uk-button-default"
                type={"button"}
                onClick={this.onRequestClick}
                disabled={!email || requested}
              >
                {"send reset code via email"}
              </button>
            </div>
          </div>

          {requested && (
            <div uk-alert="true" className="uk-alert-primary">
              <p className="uk-padding">
                {
                  "Please enter a verification code on the email we have been sent."
                }
              </p>
            </div>
          )}

          {requested && (
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="code">
                {"code"}
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input"
                  id="code"
                  type="text"
                  value={code}
                  onChange={this.onCodeChange}
                  placeholder="012345"
                />
              </div>
            </div>
          )}

          {requested && (
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="password">
                {"new password"}
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
          )}

          {requested && (
            <div className="uk-margin uk-flex uk-flex-right">
              <div className="uk-flex uk-flex-column">
                <button
                  className="uk-button uk-button-default"
                  type={"button"}
                  onClick={this.onResetClick}
                  disabled={!code || !password}
                >
                  {"reset password"}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="uk-margin uk-flex uk-flex-right">
              <div className="uk-flex uk-flex-column">
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

export default ResetPasswordRoute;
