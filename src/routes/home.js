import React from "react";
import PropTypes from "prop-types";

// Just redirect

export class HomeRoute extends React.Component {
  /**
   * propTypes
   * @type {object}
   */
  static propTypes = {
    auth: PropTypes.shape({
      userData: PropTypes.object,
      userHasRetrieved: PropTypes.bool
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired
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
        this.props.history.push(`/${__ENV__.BASE_DIR}/dashboard/`);
      } else {
        this.props.history.push(`/${__ENV__.BASE_DIR}/sign-in/`);
      }
    }
  }

  /**
   * render
   * @return {ReactElement|null|false} render a React element.
   */
  render() {
    return false;
  }
}

export default HomeRoute;
