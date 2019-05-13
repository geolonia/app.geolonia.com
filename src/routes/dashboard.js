import React from "react";
import OriginList from "../components/origin-list";
import Toggle from "../components/toggle";

export class DashboardRoute extends React.PureComponent {
  /**
   * constructor
   * @param  {object} props React props.
   * @return {void}
   */
  constructor(props) {
    super(props);
    this.state = { userKeys: [], error: false };
    if (props.auth.userData) {
      this.listKeys();
    }
  }

  listKeys = async () =>
    this.props.auth.API.listKeys()
      .then(userKeys => this.setState({ userKeys }))
      .catch(() => this.setState({ userKeys: [], error: true }));

  /**
   * componentDidUpdate
   * @param  {object} prevProps prev props
   * @param  {object} prevState prev state
   * @param  {object} snapshot  snapshot
   * @return {void}
   */
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!prevProps.auth.userData && this.props.auth.userData) {
      this.listKeys();
    }
  }

  onCreateClick = () => {
    this.setState({ error: false });
    this.props.auth.API.createKey()
      .then(data => this.setState({ userKeys: [...this.state.userKeys, data] }))
      .catch(err => this.setState({ error: true }));
  };

  onDeleteClick = e => {
    this.setState({ error: false });
    const index = e.target.value;
    const { userKey } = this.state.userKeys[index];
    return this.props.auth.API.deleteKey(userKey)
      .then(() => {
        const userKeys = [...this.state.userKeys];
        userKeys.splice(index, 1);
        this.setState({ userKeys });
      })
      .catch(err => this.setState({ error: true }));
  };

  onCheckUpdate = e => {
    this.setState({ error: false });
    const {
      name,
      checked,
      dataset: { index }
    } = e.target;
    const { userKey } = this.state.userKeys[index];
    return this.props.auth.API.updateKey(userKey, { [name]: checked })
      .then(console.log)
      .catch(err => this.setState({ error: true }));
  };

  onTextUpdate = e => {
    this.setState({ error: false });
    const {
      name,
      value,
      dataset: { index }
    } = e.target;
    const { userKey } = this.state.userKeys[index];
    return this.props.auth.API.updateKey(userKey, { [name]: value })
      .then(console.log)
      .catch(err => this.setState({ error: true }));
  };

  addOriginIndexOf = (recordIndex, origin) => {
    this.setState({ error: false });
    const userKey = { ...this.state.userKeys[recordIndex] };
    const allowedOrigins = [...userKey.allowedOrigins, origin];
    userKey.allowedOrigins = allowedOrigins;

    const userKeys = [...this.state.userKeys];
    userKeys[recordIndex] = userKey;

    this.setState({ userKeys });
    this.props.auth.API.updateKey(userKey.userKey, { allowedOrigins })
      .then(console.log)
      .catch(err => this.setState({ error: true }));
  };

  removeOriginIndexOf = (recordIndex, originIndex) => {
    this.setState({ error: false });
    const userKey = { ...this.state.userKeys[recordIndex] };
    const allowedOrigins = [...userKey.allowedOrigins];
    allowedOrigins.splice(originIndex, 1);
    userKey.allowedOrigins = allowedOrigins;

    const userKeys = [...this.state.userKeys];
    userKeys[recordIndex] = userKey;

    this.setState({ userKeys });
    this.props.auth.API.updateKey(userKey.userKey, { allowedOrigins })
      .then(console.log)
      .catch(err => this.setState({ error: true }));
  };

  render() {
    const {
      auth: { userData }
    } = this.props;
    const { userKeys, error } = this.state;

    if (!userData) {
      return null;
    }

    return (
      <main className={"uk-margin uk-padding-small"}>
        {error && (
          <div uk-alert="true" className="uk-alert-danger">
            <p className="uk-padding">{"Request failed."}</p>
          </div>
        )}

        <div className="uk-margin">
          <button
            className={"uk-button uk-button-default"}
            onClick={this.onCreateClick}
          >
            {"GENERATE API KEY"}
          </button>
        </div>

        <div className={"uk-form-stacked uk-margin"}>
          {userKeys.map(
            ({ userKey, enabled, description, allowedOrigins }, index) => (
              <div
                key={userKey}
                className={"uk-card uk-card-default uk-card-body uk-margin"}
              >
                <Toggle label={userKey} sub={description}>
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
                    <label
                      className={"uk-form-label"}
                      htmlFor={`enabled-${userKey}`}
                    >
                      {"ENABLED"}
                    </label>
                    <input
                      className={"uk-checkbox"}
                      id={`enabled-${userKey}`}
                      type={"checkbox"}
                      defaultChecked={enabled}
                      name={"enabled"}
                      data-index={index}
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
                      data-index={index}
                      placeholder={"Describe your key"}
                      onBlur={this.onTextUpdate}
                    />
                  </div>

                  <OriginList
                    origins={allowedOrigins || []}
                    recordIndex={index}
                    add={this.addOriginIndexOf}
                    remove={this.removeOriginIndexOf}
                  />

                  <button
                    className={"uk-button uk-button-default"}
                    onClick={this.onDeleteClick}
                    value={index}
                  >
                    {"DELETE KEY"}
                  </button>
                </Toggle>
              </div>
            )
          )}
        </div>
      </main>
    );
  }
}

export default DashboardRoute;
