import React from "react";

export class EmailVerification extends React.Component {
  state = {
    sent: false
  };

  onSendClick = () => {
    this.setState({ sent: true });
    this.props.auth.resend();
  };

  /**
   * render
   * @return {ReactElement|null|false} render a React element.
   */
  render() {
    const { userConfirmed } = this.props.auth;
    const { sent } = this.state;

    return (
      (!userConfirmed && sent) || (
        <nav className={"uk-margin-small uk-padding-small"}>
          <p className={"uk-text-warning"}>
            {"Your account is not verified.  Please check your email."}
            <button onClick={this.onSendClick}>
              {"resend verifivcation mail"}
            </button>
          </p>
        </nav>
      )
    );
  }
}

export default EmailVerification;
