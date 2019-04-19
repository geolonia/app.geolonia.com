import React from "react";
import { v4 } from "uuid";
import OriginList from "../components/origin-list";

export class DashboardRoute extends React.PureComponent {
  state = {
    yourApiKey: "",
    keyName: "",
    allowedOrigins: []
  };

  getApiKeyAsync = () =>
    setTimeout(() => this.setState({ yourApiKey: v4() }), 1000);

  render() {
    const { yourApiKey, keyName, allowedOrigins } = this.state;
    const {
      auth: { user }
    } = this.props;
    return (
      <main className={"uk-margin uk-padding-small"}>
        {yourApiKey ? (
          <form className={"uk-form-stacked"}>
            <div className={"uk-margin"}>
              <label className={"uk-form-label"} htmlFor={"your-api-key"}>
                {"YOUR API KEY"}
              </label>
              <div className={"uk-form-controls"}>
                <input
                  className={"uk-input"}
                  id={"your-api-key"}
                  type={"text"}
                  value={yourApiKey}
                  disabled={true}
                  onChange={x => x}
                />
              </div>
            </div>

            <div className="uk-margin">
              <label className={"uk-form-label"} htmlFor={"key-name"}>
                {"KEY NAME"}
              </label>
              <input
                className={"uk-input"}
                id={"key-name"}
                type={"text"}
                value={keyName}
                placeholder={"Key Name, eg. TileCloud inc."}
                onChange={e => this.setState({ keyName: e.target.value })}
              />
            </div>

            <OriginList
              origins={allowedOrigins}
              remove={removingOrigin =>
                this.setState({
                  allowedOrigins: allowedOrigins.filter(
                    origin => origin !== removingOrigin
                  )
                })
              }
              add={newOrigin =>
                this.setState({
                  allowedOrigins: [...allowedOrigins, newOrigin].filter(
                    (origin, i, self) => self.indexOf(origin) === i
                  )
                })
              }
            />
          </form>
        ) : (
          <button
            className={"uk-button uk-button-default"}
            onClick={this.getApiKeyAsync}
          >
            {"GET YOUR API KEY"}
          </button>
        )}
      </main>
    );
  }
}

export default DashboardRoute;
