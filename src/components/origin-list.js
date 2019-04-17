import React from "react";

const isOrigin = value => /^https?:\/\/.+$/gm.test(value);

export class OriginList extends React.PureComponent {
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
