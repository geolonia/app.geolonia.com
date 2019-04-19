import React from "react";
import PropTypes from "prop-types";

const isOrigin = value => /^https?:\/\/.+$/gm.test(value);

export class OriginList extends React.PureComponent {
  /**
   * propTypes
   * @type {object}
   */
  static propTypes = {
    origins: PropTypes.arrayOf(PropTypes.string).isRequired,
    remove: PropTypes.func.isRequired,
    add: PropTypes.func.isRequired
  };

  state = { newOrigin: "" };

  onAddClick = () => {
    this.props.add(this.state.newOrigin);
    this.setState({ newOrigin: "" });
  };

  render() {
    const { newOrigin } = this.state;
    const { origins, remove } = this.props;
    return (
      <div className={"uk-margin"}>
        <label className={"uk-form-label"} htmlFor="">
          {"ALLOWED ORIGINS"}
        </label>
        <div className={"uk-form-controls"}>
          <input
            className={"uk-input uk-form-width-medium"}
            placeholder={"https://example.com"}
            type={"text"}
            value={newOrigin}
            onChange={e => this.setState({ newOrigin: e.target.value })}
          />
          <button
            className={"uk-button uk-button-default"}
            disabled={!isOrigin(newOrigin)}
            onClick={this.onAddClick}
          >
            {"add"}
          </button>
        </div>
        <ul className={"uk-list uk-list-divider"}>
          {origins.map(origin => (
            <li key={origin}>
              <div
                className={
                  "uk-flex uk-flex-wrap uk-flex-between uk-flex-middle"
                }
              >
                <span>{origin}</span>
                <button
                  className={"uk-button uk-button-default"}
                  onClick={() => remove(origin)}
                >
                  {"remove"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default OriginList;
