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
  const [username, setUsername] = React.useState("");
  const [status, setStatus] = React.useState<
    null | "requesting" | "success" | "failure"
  >(null);

  const handleSignup = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setStatus("requesting");
    props.setCurrentUser(username);
    delay(sendVerificationEmail(username), 500)
      .then(() => {
        setStatus("success");
      })
      .catch(() => {
        // TODO: show messages
        setStatus("failure");
      })
      .finally(() => props.history.push("/reset-password"));
  };

  return (
    <div className="signup">
      <div className="container">
        <img src={Logo} alt="" className="logo" />
        <h1>{__("Reset your password")}</h1>

        <div className="form">
          <label className="email">
            <h3>{__("Username or email address")}</h3>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
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
              disabled={username.trim() === ""}
            >
              {__("Send password reset email")}
            </Button>
          </p>
          {status === "requesting" && (
            <div style={{ marginTop: ".75em" }}>
              <CircularProgress size={20} />
            </div>
          )}
        </div>

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
