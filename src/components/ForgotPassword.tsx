import React from "react";

import Button from "@material-ui/core/Button";
import { __ } from "@wordpress/i18n";

import Support from "./custom/Support";
import "./ForgotPassword.scss";
import Logo from "./custom/logo.svg";
import { CircularProgress } from "@material-ui/core";
import { sendVerificationEmail } from "../auth";
import delay from "../lib/promise-delay";
import { connect } from "react-redux";
import { createActions } from "../redux/actions/auth-support";
import Alert from "./custom/Alert";

type OwnProps = {};
type RouterProps = {
  history: {
    push: (path: string) => void;
  };
};
type DispatchProps = {
  setCurrentUser: (currentUser: string) => void;
};
type Props = OwnProps & RouterProps & DispatchProps;

const Content = (props: Props) => {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<
    null | "requesting" | "success" | "warning"
  >(null);
  const [message, setMessage] = React.useState("");

  const handleSignup = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event && event.preventDefault();
    setStatus("requesting");
    props.setCurrentUser(email); // TODO: remove
    delay(sendVerificationEmail(email), 500)
      .then(result => {
        setStatus("success");
        props.history.push("/reset-password");
      })
      .catch(error => {
        setStatus("warning");
        if (error.code === "UserNotFoundException") {
          setMessage(__("User not found. Please check entered username."));
        } else if (
          error.code === "InvalidParameterException" &&
          error.message.indexOf("verified email") > -1
        ) {
          setMessage(
            __(
              "Cannot reset password for the user as there is no verified email."
            )
          );
        } else if (error.code === "LimitExceededException") {
          setMessage(__("Attempt limit exceeded, please try after some time."));
        } else {
          setMessage(__("Unknown error."));
        }
      });
  };

  const buttonDisabled =
    email.trim() === "" || status === "success" || status === "requesting";

  return (
    <div className="signup">
      <div className="container">
        <img src={Logo} alt="" className="logo" />
        <h1>{__("Reset your password")}</h1>
        {status === "warning" && <Alert type={status}>{message}</Alert>}
        <form className="form">
          <label className="email">
            <h3>{__("Email address")}</h3>
            <input
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </label>
          <p className="message">
            {__("We will send you a verification code to reset your password.")}
          </p>
          <p>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSignup}
              disabled={buttonDisabled}
              type={"submit"}
            >
              {__("Send password reset email")}
            </Button>
          </p>
          {status === "requesting" && (
            <div style={{ marginTop: ".75em" }}>
              <CircularProgress size={20} />
            </div>
          )}
        </form>

        <div className="support-container">
          <Support />
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  setCurrentUser: (currentUser: string) =>
    dispatch(createActions.setCurrentUser(currentUser))
});

export default connect(void 0, mapDispatchToProps)(Content);
