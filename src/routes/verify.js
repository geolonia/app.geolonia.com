import React from "react";
import PropTypes from "prop-types";

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
      push: PropTypes.func.isRequired
    }).isRequired
  };

  state = {
    email: "",
    code: "",
    error: void 0
  };

  _onChange = (key, value) => this.setState({ [key]: value, error: void 0 });
  onEmailChange = e => this._onChange("email", e.target.value);
  onCodeChange = e => this._onChange("code", e.target.value);

  onVerifyClick = () => {
    const email =
      (this.props.auth.userData && this.props.auth.userData.user.username) ||
      this.state.email;
    this.props.auth
      .verify(email, this.state.code)
      .catch(error => console.log(error) || this.setState({ error }));
  };

  render() {
    const { email, code, error } = this.state;

    return (
      <main className={"uk-margin uk-padding-small"}>
        <h3 className="uk-card-title">{"Code Verification"}</h3>
        <form className="uk-form-horizontal" action={"#"}>
          {this.props.auth.userData || (
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="username">
                {"username"}
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input"
                  id="username"
                  type="text"
                  value={email}
                  onChange={this.onEmailChange}
                  placeholder="username@example.com"
                />
              </div>
            </div>
          )}

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

          <div className="uk-margin uk-flex uk-flex-right">
            <div className="uk-flex uk-flex-column">
              <button
                className="uk-button uk-button-default"
                type={"button"}
                onClick={this.onVerifyClick}
              >
                {"verify"}
              </button>
            </div>
          </div>
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

export default VerifyCodeRoute;
