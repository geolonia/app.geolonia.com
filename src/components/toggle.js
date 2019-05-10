import React from "react";
import PropTypes from "prop-types";

export class Toggle extends React.Component {
  /**
   * propTypes
   * @type {object}
   */
  static propTypes = {
    defaultOpen: PropTypes.bool,
    label: PropTypes.string.isRequired,
    sub: PropTypes.string
  };

  /**
   * defaultProps
   * @type {object}
   */
  static defaultProps = {
    defaultOpen: false,
    sub: ""
  };

  /**
   * constructor
   * @param  {object} props React props.
   * @return {void}
   */
  constructor(props) {
    super(props);
    this.state = {
      open: props.defaultOpen
    };
  }

  onToggleClick = () => this.setState({ open: !this.state.open });

  /**
   * render
   * @return {ReactElement|null|false} render a React element.
   */
  render() {
    const { open } = this.state;
    const { label, sub, children } = this.props;

    return (
      <div style={{ position: "relative" }}>
        <button
          style={{
            position: "absolute",
            top: 8,
            left: -15,
            background: "none",
            border: "none",
            cursor: "pointer",
            outline: "none"
          }}
          onClick={this.onToggleClick}
        >
          {open ? "V" : ">"}
        </button>
        <div className={"uk-margin-left"}>
          {open ? (
            children
          ) : (
            <div>
              <p className={"uk-margin-remove-bottom"}>{label}</p>
              <p className={"uk-margin-remove-bottom uk-text-meta"}>
                {sub || "(No description)"}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Toggle;
