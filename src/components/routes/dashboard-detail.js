import React from "react";
import PropTypes from "prop-types";
import Spinner from "../spinner";
import { Link } from "react-router-dom";
import DummyChart from "../dummy-chart";
import { __ } from "@wordpress/i18n";
import ModalBeforeDelete from "../modal-before-delete";
import normalizeURL from "../../lib/normalize-url";

export class DashboarDetailRoute extends React.PureComponent {
  /**
   * propTypes
   * @type {object}
   */
  static propTypes = {
    auth: PropTypes.any,
    history: PropTypes.any,
    match: PropTypes.any
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
      nextUserKeyProps: {},
      openModal: false
    };
  }

  /**
   * componentDidMount
   * @return {void}
   */
  componentDidMount() {
    if (this.props.auth.userData) {
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

  onCopyToClipboardClick = userKey => () => {
    const clipboard = document.getElementById("clipboard");
    clipboard.value = userKey;
    clipboard.select();
    document.execCommand("copy");
  };

  onSaveClick = () => {
    this.setState({ requesting: true, error: false });
    const { nextUserKeyProps } = this.state;
    console.log(this.props);
    const {
      match: {
        params: { userKey }
      }
    } = this.props;

    const updateProps = {
      ...nextUserKeyProps,
      allowedOrigins:
        nextUserKeyProps.allowedOrigins &&
        nextUserKeyProps.allowedOrigins
          .split("\n")
          .map(normalizeURL)
          .filter(x => !!x)
    };
    this.props.auth.API.updateKey(userKey, updateProps)
      .then(() => {
        const userKeys = [...this.state.userKeys];
        const index = userKeys.map(x => x.userKey).indexOf(userKey);
        userKeys[index] = { ...userKeys[index], ...updateProps };
        this.setState({ userKeys, requesting: false, nextUserKeyProps: {} });
      })
      .catch(
        error =>
          console.error(error) || this.setState({ error, requesting: false })
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

  onDeleteClick = () => {
    this.setState({ openModal: true });
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
      nextUserKeyProps,
      openModal
    } = this.state;

    if (!userData) {
      return null;
    }

    const prevUserKeyProps = userKeys.find(
      ({ userKey }) => userKey === userKeyFilter
    );

    if (!requesting && !prevUserKeyProps) {
      return (
        <main
          className={
            "uk-container uk-container-medium uk-margin uk-padding-small"
          }
        >
          {"not found"}
        </main>
      );
    }

    const { name, enabled, allowedOrigins } = {
      ...prevUserKeyProps,
      ...nextUserKeyProps
    };

    const displayAllowedOrigins = Array.isArray(allowedOrigins)
      ? allowedOrigins.join("\n")
      : allowedOrigins;

    return (
      <main
        className={
          "uk-container uk-container-medium uk-margin uk-padding-small"
        }
      >
        <ul className={"uk-breadcrumb"}>
          <li>
            <Link className={"uk-text-uppercase"} to={"/app/dashboard"}>
              {__("maps", "geolonia-dashboard")}
            </Link>
          </li>
          <li>
            {(prevUserKeyProps || {}).name ||
              __("(no name)", "geolonia-dashboard")}
          </li>
        </ul>

        {error && (
          <div uk-alert={"true"} className={"uk-alert-danger"}>
            <p className={"uk-padding"}>
              {__("Request failed.", "geolonia-dashboad")}
            </p>
          </div>
        )}

        <div className={"uk-card uk-card-default uk-card-body uk-margin"}>
          <h3 className={"uk-text-large uk-text-uppercase"}>
            {__("traffic", "geolonia-dashboard")}
          </h3>
          <DummyChart></DummyChart>
        </div>

        <div className={"uk-card uk-card-default uk-card-body uk-margin"}>
          <h3 className={"uk-text-large uk-text-uppercase"}>
            {__("settings", "geolonia-dashboard")}
          </h3>

          <div className={"uk-margin"}>
            <label
              className={"uk-form-label uk-text-uppercase"}
              htmlFor={"name"}
            >
              {__("map name", "geolonia-dashboard")}
            </label>
            <input
              className={"uk-input"}
              id={"name"}
              type={"text"}
              defaultValue={name}
              name={"name"}
              placeholder={__("map name", "geolonia-dashboard")}
              onChange={this.onTextUpdate}
            />
          </div>

          <div className={"uk-margin"}>
            <div className={"uk-form-controls"}>
              <label className={"uk-form-label"} htmlFor={"allowed-origins"}>
                <span className={"uk-text-uppercase"}>
                  {__("allowed origins", "geolonia-dashboard")}
                </span>
                {` (${__("an origin per a line", "geolonia-dashboard")})`}
              </label>
              <textarea
                className={"uk-textarea"}
                name={"allowedOrigins"}
                id={"allowed-origins"}
                onChange={this.onTextareaUpdate}
                value={displayAllowedOrigins}
                placeholder={__(
                  "e.g.\nhttps://example.com\nhttp://example.com",
                  "geolonia-dashboard"
                )}
              />
            </div>
          </div>

          <div className={"uk-margin"}>
            <label
              className={"uk-form-label uk-text-uppercase"}
              htmlFor={`enabled`}
            >
              <input
                className={"uk-checkbox"}
                id={`enabled`}
                type={"checkbox"}
                defaultChecked={enabled}
                name={"enabled"}
                onChange={this.onCheckUpdate}
              />
              {` ${__("availability", "geolonia-dashboard")}`}
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
              {__("update map", "geolonia-dashboard")}
            </button>
          </div>
        </div>

        <div className={"uk-card uk-card-default uk-card-body uk-margin"}>
          <h3 className={"uk-text-large uk-text-uppercase"}>
            {__("snippets", "geolonia-dashboard")}
          </h3>
          <p>
            {__(
              "Insert the script tag below just before body closing tag.",
              "geolonia-dashboard"
            )}
          </p>
          <textarea
            className={"uk-textarea"}
            name={"script-snippet"}
            id={"script-snippet"}
            rows={1}
            style={{ resize: "none" }}
            defaultValue={` <script type="text/javascript" src="https://api.tilecloud.io/v1/embed?tilecloud-api-key=${userKeyFilter}"></script>`}
          />
        </div>

        <div className={"uk-card uk-card-default uk-card-body uk-margin"}>
          <h3 className={"uk-text-large uk-text-uppercase"}>
            {__("danger zone", "geolonia-dashboard")}
          </h3>
          <button
            className={"uk-button uk-button-danger"}
            onClick={this.onDeleteClick}
          >
            {__("delete this map", "geolonia-dashboard")}
          </button>
        </div>
        <ModalBeforeDelete
          open={openModal}
          close={() => this.setState({ openModal: false })}
          userKey={userKeyFilter}
          onDeleteSuccess={() => this.props.history.replace(`/app/dashboard/`)}
          auth={this.props.auth}
        ></ModalBeforeDelete>
        {this.renderClipboard()}
      </main>
    );
  }
}

export default DashboarDetailRoute;
