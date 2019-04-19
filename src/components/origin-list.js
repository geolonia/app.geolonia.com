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
  render() {
    const { newOrigin } = this.state;
    const { origins, remove, add } = this.props;
    return (
      <div>
        <ul>
          {origins.map(origin => (
            <li key={origin}>
              {origin}
              <button onClick={() => remove(origin)}>{"remove"}</button>
            </li>
          ))}
        </ul>
        <input
          type={"text"}
          value={newOrigin}
          onChange={e => this.setState({ newOrigin: e.target.value })}
        />
        <button
          disabled={!isOrigin(newOrigin)}
          onClick={() => {
            add(newOrigin);
            this.setState({ newOrigin: "" });
          }}
        >
          {"add"}
        </button>
      </div>
    );
  }
}

export default OriginList;
