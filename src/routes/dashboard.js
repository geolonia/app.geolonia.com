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
    return (
      <main>
        <h2>{"ダッシュボード"}</h2>
        {yourApiKey ? (
          <div>
            <label htmlFor={"your-api-key"}>{"YOUR API KEY"}</label>
            <input
              id={"your-api-key"}
              type={"text"}
              value={yourApiKey}
              disabled={true}
              onChange={x => x}
            />
            <label htmlFor={"key-name"}>{"KEY NAME"}</label>
            <input
              id={"key-name"}
              type={"text"}
              value={keyName}
              onChange={e => this.setState({ keyName: e.target.value })}
            />
            <h3>{"Allowed Origins"}</h3>
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
          </div>
        ) : (
          <button onClick={this.getApiKeyAsync}>{"GET YOUR API KEY"}</button>
        )}
      </main>
    );
  }
}

export default DashboardRoute;
