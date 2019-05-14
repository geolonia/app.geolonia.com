import React from "react";
import PropTypes from "prop-types";

export class OriginList extends React.PureComponent {
  /**
   * propTypes
   * @type {object}
   */
  static propTypes = {
    origins: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired
  };

  state = { editing: false };

  onTextAreaFocus = e =>
    this.setState({ editing: this.props.origins.join("\n") });
  onTextAreaChange = e => this.setState({ editing: e.target.value });
  onTextAreaBlur = () => {
    this.props.onChange(this.state.editing.split("\n"));
    this.setState({ editing: false });
  };

  render() {
    const { editing } = this.state;
    const { origins } = this.props;

    return (
      <div className={"uk-margin"}>
        <div className={"uk-form-controls"}>
          <label className={"uk-form-label"} htmlFor="allowed-origins">
            {"ALLOWED ORIGINS"}
          </label>
          <textarea
            className={"uk-textarea"}
            name="allowed-origins"
            id="allowed-origins"
            onFocus={this.onTextAreaFocus}
            onChange={this.onTextAreaChange}
            onBlur={this.onTextAreaBlur}
            value={editing || origins.join("\n")}
          />
        </div>
      </div>
    );
  }
}

export default OriginList;
