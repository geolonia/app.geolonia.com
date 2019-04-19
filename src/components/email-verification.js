import React from "react";

export class EmailVerification extends React.Component {
  state = {
    sent: false
  };

  render() {
    const { user } = this.props;
    const { sent } = this.state;
    return (
      sent ||
      user.emailVerified || (
        <nav className={"uk-margin-small uk-padding-small"}>
          <p className={"uk-text-warning"}>
            {"Your account is not verified.  "}
            <a
              href={"#"}
              onClick={() => {
                this.setState({ sent: true });
                user.sendEmailVerification();
              }}
            >
              {"resend verifivcation mail."}
            </a>
          </p>
        </nav>
      )
    );
  }
}

export default EmailVerification;
