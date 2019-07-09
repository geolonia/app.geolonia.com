import React from "react";
import PropTypes from "prop-types";
import Spinner from "../spinner";
import { Link } from "react-router-dom";

export class DashboarDetailRoute extends React.PureComponent {
  /**
   * propTypes
   * @type {object}
   */
  static propTypes = {
    auth: PropTypes.any,
    history: PropTypes.any
  };

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
      requesting: false,
      deletingIndex: -1,
      nextUserKeyProps: {}
    };
    if (props.auth.userData) {
      this.listKeys();
    }
  }

  listKeys = async () => {
    this.setState({ requesting: true });
    this.props.auth.API.listKeys()
      .then(userKeys => this.setState({ requesting: false, userKeys }))
      .catch(
        err =>
          console.error(err) ||
          this.setState({ userKeys: [], error: true, requesting: false })
      );
  };

  /**
   * componentDidUpdate
   * @param  {object} prevProps prev props
   * @param  {object} prevState prev state
   * @param  {object} snapshot  snapshot
   * @return {void}
   */
  componentDidUpdate(prevProps) {
    if (!prevProps.auth.userHasRetrieved && this.props.auth.userHasRetrieved) {
      if (this.props.auth.userData) {
        this.listKeys();
      } else {
        this.props.history.push(`/app/sign-in`);
      }
    }
  }

  onCreateClick = () => {
    this.setState({ error: false, requesting: true });
    this.props.auth.API.createKey()
      .then(data =>
        this.setState({
          userKeys: [...this.state.userKeys, data],
          requesting: false
        })
      )
      .catch(() => this.setState({ error: true, requesting: false }));
  };

  onCopyToClipboardClick = userKey => () => {
    const clipboard = document.getElementById("clipboard");
    clipboard.value = userKey;
    clipboard.select();
    document.execCommand("copy");
  };

  onSaveClick = () => {
    this.setState({ requesting: true, error: false });
    const { nextUserKeyProps } = this.state;
    console.log(this.props)
    const {match: {
        params: { userKey }
      } }= this.props;

      const updateProps = {...nextUserKeyProps, allowedOrigins: nextUserKeyProps.allowedOrigins && nextUserKeyProps.allowedOrigins.split('\n')}
      console.log(updateProps)
    this.props.auth.API.updateKey(userKey, updateProps)
      .then(() => {
        const userKeys = [...this.state.userKeys];
        const index = userKeys.map(x => x.userKey).indexOf(userKey);
        userKeys[index] = { ...userKeys[index], ...updateProps };
        this.setState({ userKeys, requesting: false });
      })
      .catch(error => console.error(error) || this.setState({ error, requesting: false }));
  };

  onDeleteClick = userKey => () => {
    const nextUserKeys = [...this.state.userKeys];
    const index = nextUserKeys.map(x => x.userKey).indexOf(userKey);
    this.setState({ error: false, requesting: true, deletingIndex: index });

    return this.props.auth.API.deleteKey(userKey)
      .then(() => {
        nextUserKeys.splice(index, 1);
        this.setState({
          userKeys: nextUserKeys,
          requesting: false,
          deletingIndex: -1
        });
      })
      .catch(() =>
        this.setState({ error: true, requesting: false, deletingIndex: -1 })
      );
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
    this.setState({
      nextUserKeyProps: {
        ...this.state.nextUserKeyProps,
        [name]: value
      }
    });
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
      auth: { userData },
      match: {
        params: { userKey: userKeyFilter }
      }
    } = this.props;

    const {
      userKeys,
      error,
      requesting,
      deletingIndex,
      nextUserKeyProps
    } = this.state;

    if (!userData) {
      return null;
    }

    const prevUserKeyProps = userKeys.find(({ userKey }) => userKey === userKeyFilter)

    if (!prevUserKeyProps) {
      return <main
        className={
          "uk-container uk-container-medium uk-margin uk-padding-small"
        }
      >{'not found'}</main>
    }

    const { name, enabled, userKey, allowedOrigins } = {
      ...prevUserKeyProps,
      ...nextUserKeyProps,
    }

    const displayAllowedOrigins = Array.isArray(allowedOrigins) ? allowedOrigins.join('\n') : allowedOrigins

    return (
      <main
        className={
          "uk-container uk-container-medium uk-margin uk-padding-small"
        }
      >
        <ul className={"uk-breadcrumb"}>
          <li>
            <Link to={"/app/dashboard"}>{"DASHBOARD"}</Link>
          </li>
          <li>{(prevUserKeyProps || {}).name || "(no name)"}</li>
        </ul>

        {error && (
          <div uk-alert={"true"} className={"uk-alert-danger"}>
            <p className={"uk-padding"}>{"Request failed."}</p>
          </div>
        )}
        <div className={"uk-card uk-card-default uk-card-body"}>
          <button
            className={"uk-modal-close-default"}
            type={"button"}
            style={{ background: "none", border: "none" }}
            onClick={this.onCloseModalClick}
          >
            <span className="uk-margin-small-right" uk-icon="close" />
          </button>

          <div className={"uk-margin"}>
            <label className={"uk-form-label"} htmlFor={"name"}>
              {"NAME"}
            </label>
            <input
              className={"uk-input"}
              id={"name"}
              type={"text"}
              defaultValue={name}
              name={"name"}
              placeholder={"Provide name to your key"}
              onChange={this.onTextUpdate}
            />
          </div>

          <div className={"uk-margin"}>
            <div className={"uk-form-controls"}>
              <label className={"uk-form-label"} htmlFor={"allowed-origins"}>
                {"ALLOWED ORIGINS (an origin per a line)"}
              </label>
              <textarea
                className={"uk-textarea"}
                name={"allowedOrigins"}
                id={"allowed-origins"}
                onChange={this.onTextareaUpdate}
                value={displayAllowedOrigins}
              />
            </div>
          </div>

          <div className={"uk-margin"}>
            <label className={"uk-form-label"} htmlFor={`enabled-${userKey}`}>
            <input
              className={"uk-checkbox"}
              id={`enabled-${userKey}`}
              type={"checkbox"}
              defaultChecked={enabled}
              name={"enabled"}
              onChange={this.onCheckUpdate}
            />
              {" ENABLED"}
            </label>
          </div>

          <div className={"uk-margin"}>
            <button
              className={"uk-button uk-button-default"}
              onClick={this.onSaveClick}
              disabled={
                requesting || Object.keys(nextUserKeyProps).length === 0
              }
            >
              <Spinner loading={requesting} />
              {"SAVE"}
            </button>
          </div>
        </div>

        {this.renderClipboard()}
      </main>
    );
  }
}

export default DashboarDetailRoute;
