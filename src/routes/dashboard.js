import React from "react";

export class DashboardRoute extends React.PureComponent {
  /**
   * constructor
   * @param  {object} props React props.
   * @return {void}
   */
  constructor(props) {
    super(props);
    this.state = {
      userKeys: [],
      openedUserKey: false,
      error: false,
      nextUserKeyProps: {}
    };
    if (props.auth.userData) {
      this.listKeys();
    }
  }

  listKeys = async () =>
    this.props.auth.API.listKeys()
      .then(userKeys => this.setState({ userKeys }))
      .catch(
        err =>
          console.error(err) || this.setState({ userKeys: [], error: true })
      );

  /**
   * componentDidUpdate
   * @param  {object} prevProps prev props
   * @param  {object} prevState prev state
   * @param  {object} snapshot  snapshot
   * @return {void}
   */
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!prevProps.auth.userHasRetrieved && this.props.auth.userHasRetrieved) {
      if (this.props.auth.userData) {
        this.listKeys();
      } else {
        this.props.history.push("/sign-in/");
      }
    }
  }

  onCreateClick = () => {
    this.setState({ error: false });
    this.props.auth.API.createKey()
      .then(data => this.setState({ userKeys: [...this.state.userKeys, data] }))
      .catch(err => this.setState({ error: true }));
  };

  onCopyToClipboardClick = userKey => () => {
    const clipboard = document.getElementById("clipboard");
    clipboard.value = userKey;
    clipboard.select();
    document.execCommand("copy");
  };

  onOpenModalClick = openedUserKey => () =>
    this.setState({ error: false, openedUserKey });
  onCloseModalClick = () =>
    this.setState({ error: false, openedUserKey: false, nextUserKeyProps: {} });

  onSaveClick = () => {
    const { openedUserKey, nextUserKeyProps } = this.state;
    this.props.auth.API.updateKey(openedUserKey, nextUserKeyProps)
      .then(() => {
        const userKeys = [...this.state.userKeys];
        const index = userKeys.map(x => x.userKey).indexOf(openedUserKey);
        userKeys[index] = { ...userKeys[index], ...nextUserKeyProps };
        this.setState({ userKeys });
        this.onCloseModalClick();
      })
      .catch(err => this.setState({ error: true }));
  };

  onDeleteClick = userKey => () => {
    this.setState({ error: false });
    return this.props.auth.API.deleteKey(userKey)
      .then(() => {
        const userKeys = [...this.state.userKeys];
        const index = userKeys.map(x => x.userKey).indexOf(userKey);
        userKeys.splice(index, 1);
        this.setState({ userKeys });
      })
      .catch(err => this.setState({ error: true }));
  };

  onCheckUpdate = e => {
    const { name, checked } = e.target;
    this.setState({
      nextUserKeyProps: { ...this.state.nextUserKeyProps, [name]: checked }
    });
  };

  onTextUpdate = e => {
    const { name, value } = e.target;
    this.setState({
      nextUserKeyProps: { ...this.state.nextUserKeyProps, [name]: value }
    });
  };

  onTextareaUpdate = e => {
    const { name, value } = e.target;
    const formatedValue = value.replace(/ /g, "").split("\n");
    this.setState({
      nextUserKeyProps: {
        ...this.state.nextUserKeyProps,
        [name]: formatedValue
      }
    });
  };

  renderModalContent = () => {
    const { userKeys, openedUserKey } = this.state;
    if (!openedUserKey) {
      return false;
    }

    const { userKey, enabled, allowedOrigins, description } =
      userKeys.find(x => x.userKey === openedUserKey) || {};

    if (!userKey) {
      return false;
    }

    return (
      <div className={"uk-flex-top uk-modal uk-flex uk-open"} uk-modal={true}>
        <div
          className={"uk-modal-dialog uk-modal-body uk-margin-auto-vertical"}
        >
          <button
            className={"uk-modal-close-default"}
            type={"button"}
            style={{ background: "none", border: "none" }}
            onClick={this.onCloseModalClick}
          >
            <i className={"fa fa-times"} />
          </button>
          <label className={"uk-form-label"} htmlFor={"your-api-key"}>
            {"API KEY"}
          </label>
          <div className={"uk-form-controls"}>
            <input
              className={"uk-input"}
              id={"your-api-key"}
              type={"text"}
              value={userKey}
              disabled={true}
            />
          </div>

          <div className={"uk-margin"}>
            <label className={"uk-form-label"} htmlFor={`enabled-${userKey}`}>
              {"ENABLED"}
            </label>
            <input
              className={"uk-checkbox"}
              id={`enabled-${userKey}`}
              type={"checkbox"}
              defaultChecked={enabled}
              name={"enabled"}
              onChange={this.onCheckUpdate}
            />
          </div>

          <div className={"uk-margin"}>
            <label className={"uk-form-label"} htmlFor={"description"}>
              {"DESCRIPTION"}
            </label>
            <input
              className={"uk-input"}
              id={"description"}
              type={"text"}
              defaultValue={description}
              name={"description"}
              placeholder={"Describe your key"}
              onChange={this.onTextUpdate}
            />
          </div>

          <div className={"uk-margin"}>
            <div className={"uk-form-controls"}>
              <label className={"uk-form-label"} htmlFor={"allowed-origins"}>
                {"ALLOWED ORIGINS (an origin per line)"}
              </label>
              <textarea
                className={"uk-textarea"}
                name={"allowedOrigins"}
                id={"allowed-origins"}
                onChange={this.onTextareaUpdate}
                defaultValue={allowedOrigins.join("\n")}
              />
            </div>
          </div>
          <div className={"uk-margin"}>
            <button
              className={"uk-button uk-button-default"}
              onClick={this.onSaveClick}
            >
              {"SAVE"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  renderClipboard = () => (
    <input
      type={"text"}
      style={{ top: -9999, left: -9999, position: "absolute" }}
      value={""}
      readOnly
      id={"clipboard"}
    />
  );

  render() {
    const {
      auth: { userData }
    } = this.props;
    const { userKeys, error } = this.state;

    if (!userData) {
      return null;
    }

    return (
      <main
        className={
          "uk-container uk-container-medium uk-margin uk-padding-small"
        }
      >
        {error && (
          <div uk-alert={"true"} className={"uk-alert-danger"}>
            <p className={"uk-padding"}>{"Request failed."}</p>
          </div>
        )}

        <div className={"uk-margin"}>
          <button
            className={"uk-button uk-button-default"}
            onClick={this.onCreateClick}
          >
            {"GENERATE API KEY"}
          </button>
        </div>

        {/* development */}
        <table className={"uk-table uk-table-divider"}>
          <thead>
            <tr>
              <th>{"Description"}</th>
              <th>{"API KEY"}</th>
              <th>{userKeys.length > 1 ? "Origins" : "Origin"}</th>
            </tr>
          </thead>
          <tbody>
            {userKeys.map(
              ({ userKey, enabled, description, allowedOrigins }, index) => (
                <tr key={userKey}>
                  <td>{description || "(no description)"}</td>
                  <td>
                    {userKey}
                    <button
                      className={"uk-button"}
                      onClick={this.onCopyToClipboardClick(userKey)}
                    >
                      <i className={"fa fa-clipboard"} />
                    </button>
                  </td>
                  <td>{allowedOrigins.join(", ")}</td>
                  <td>
                    <button
                      className={"uk-button"}
                      style={{ marginRight: 10 }}
                      onClick={this.onOpenModalClick(userKey)}
                    >
                      <i className={"fa fa-edit"} />
                    </button>
                    <button
                      className={"uk-button"}
                      onClick={this.onDeleteClick(userKey)}
                    >
                      <i className={"fa fa-trash"} />
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>

        {/*modal*/}
        {this.renderModalContent()}
        {this.renderClipboard()}
      </main>
    );
  }
}

export default DashboardRoute;
