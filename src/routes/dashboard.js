import React from "react";
import OriginList from "../components/origin-list";

export class DashboardRoute extends React.PureComponent {
  /**
   * constructor
   * @param  {object} props React props.
   * @return {void}
   */
  constructor(props) {
    super(props);
    this.state = { userKeys: [] };
    props.auth.API.listKeys().then(userKeys => this.setState({ userKeys }));
  }

  onCreateClick = () =>
    this.props.auth.API.createKey().then(data =>
      this.setState({ userKeys: [...this.state.userKeys, data] })
    );

  onDeleteClick = e => {
    const userKey = e.target.value;
    return this.props.auth.API.deleteKey(userKey).then(() => {
      const index = this.state.userKeys.map(x => x.userKey).indexOf(userKey);
      const userKeys = [...this.state.userKeys];
      userKeys.splice(index, 1);
      this.setState({ userKeys });
    });
  };

  onCheckUpdate = e => {
    const {
      name,
      checked,
      dataset: { userKey }
    } = e.target;
    return this.props.auth.API.updateKey(userKey, { [name]: checked }).then(
      console.log
    );
  };

  onTextUpdate = e => {
    const {
      name,
      value,
      checked,
      dataset: { userKey }
    } = e.target;
    console.log(checked);
    return this.props.auth.API.updateKey(userKey, { [name]: value }).then(
      console.log
    );
  };

  render() {
    const { userKeys } = this.state;

    return (
      <main className={"uk-margin uk-padding-small"}>
        <form className={"uk-form-stacked"} action="#">
          <div className={"uk-margin"}>
            {userKeys.map(
              ({ userKey, enabled, description, allowedOrigins }) => (
                <div
                  key={userKey}
                  className={"uk-card uk-card-default uk-card-body uk-margin"}
                >
                  <label className={"uk-form-label"} htmlFor={"your-api-key"}>
                    {"YOUR API KEY"}
                  </label>
                  <div className={"uk-form-controls"}>
                    <input
                      className={"uk-input"}
                      id={"your-api-key"}
                      type={"text"}
                      value={userKey}
                      disabled={true}
                      // onChange={x => x}
                    />
                  </div>

                  <div className="uk-margin">
                    <label className={"uk-form-label"} htmlFor={"enabled"}>
                      {"ENABLED"}
                    </label>
                    <input
                      className={"uk-checkbox"}
                      id={"enabled"}
                      type={"checkbox"}
                      defaultChecked={enabled}
                      name={"enabled"}
                      data-user-key={userKey}
                      onChange={this.onCheckUpdate}
                    />
                  </div>

                  <div className="uk-margin">
                    <label className={"uk-form-label"} htmlFor={"description"}>
                      {"DESCRIPTION"}
                    </label>
                    <input
                      className={"uk-input"}
                      id={"description"}
                      type={"text"}
                      defaultValue={description}
                      name={"description"}
                      data-user-key={userKey}
                      placeholder={"Describe your key"}
                      onBlur={this.onTextUpdate}
                    />
                  </div>

                  <OriginList
                    origins={allowedOrigins || []}
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

                  <button
                    className={"uk-button uk-button-default"}
                    onClick={this.onDeleteClick}
                    value={userKey}
                  >
                    {"DELETE KEY"}
                  </button>
                </div>
              )
            )}
          </div>

          <button
            className={"uk-button uk-button-default"}
            onClick={this.onCreateClick}
          >
            {"GET YOUR API KEY"}
          </button>
        </form>
      </main>
    );
  }
}

export default DashboardRoute;
