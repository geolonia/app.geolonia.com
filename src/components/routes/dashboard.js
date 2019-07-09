import React from "react";
import PropTypes from "prop-types";
import Spinner from "../spinner";
import { Link } from "react-router-dom";

export class DashboardRoute extends React.PureComponent {
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
    const { userKeys, error, requesting, deletingIndex } = this.state;

    if (!userData) {
      return null;
    }

    return (
      <main
        className={
          "tilecloud-app uk-container uk-container-medium uk-margin uk-padding-small"
        }
      >
        {error && (
          <div uk-alert={"true"} className={"uk-alert-danger"}>
            <p className={"uk-padding"}>{"Request failed."}</p>
          </div>
        )}

        <div className={"uk-margin uk-align-right"}>
          <button
            className={"uk-button uk-button-default"}
            onClick={this.onCreateClick}
            disabled={requesting}
          >
            <Spinner loading={requesting} />
            {"GENERATE MAP"}
          </button>
        </div>

        {/* development */}
        <table className={"uk-table uk-table-divider uk-table-striped"}>
          <tbody>
            {userKeys.map(({ userKey, allowedOrigins, name }, index) => (
              <tr
                key={userKey}
                className={
                  "api-key-list" +
                  (deletingIndex === index ? " api-key-list__deleting" : "")
                }
              >
                <td>
                  <span className={"uk-text-bold"}>{name || "(no name)"}</span>
                </td>

                <td>{allowedOrigins.join(",")}</td>

                <td>
                  <Link to={`/app/dashboard/${userKey}`}>{"detail"}</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {this.renderClipboard()}
      </main>
    );
  }
}

export default DashboardRoute;
