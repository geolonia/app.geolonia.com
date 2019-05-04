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
    code: "",
    error: void 0
  };

  _onChange = (key, value) => this.setState({ [key]: value, error: void 0 });
  onCodeChange = e => this._onChange("code", e.target.value);

  onVerifyClick = () => {
    const email = this.props.auth.userData.user.username;
    this.props.auth
      .verify(email, this.state.code)
      .catch(error => console.log(error) || this.setState({ error }));
  };

  render() {
    const { code, error } = this.state;

    return (
      <main className={"uk-margin uk-padding-small"}>
        <h3 className="uk-card-title">{"Code Verification"}</h3>
        <form className="uk-form-horizontal" action={"#"}>
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

export default VerifyCodeRoute;
