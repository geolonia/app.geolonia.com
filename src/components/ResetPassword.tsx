import "./ResetPassword.scss";

import React from "react";
import Button from "@material-ui/core/Button";
import Support from "./custom/Support";
import Logo from "./custom/logo.svg";
import { CircularProgress } from "@material-ui/core";
import Alert from "./custom/Alert";

// API
import { resetPassword } from "../auth";

// Utils
import { __ } from "@wordpress/i18n";
import { connect } from "react-redux";

// Types
import { AppState } from "../types";

type OwnProps = {};
type RouterProps = {
  history: {
    push: (path: string) => void;
  };
};
type StateProps = {
  currentUser: string;
};
type Props = OwnProps & RouterProps & StateProps;

const Content = (props: Props) => {
  const [code, setCode] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordAgain, setPasswordAgain] = React.useState("");

  const [status, setStatus] = React.useState<
    null | "requesting" | "success" | "warning"
  >(null);

  const onCodeChange = (e: React.FormEvent<HTMLInputElement>) => {
    setStatus(null);
    setCode(e.currentTarget.value);
  };
  const onPasswordChange = (e: React.FormEvent<HTMLInputElement>) => {
    setStatus(null);
    setPassword(e.currentTarget.value);
  };
  const onPasswordAgainChange = (e: React.FormEvent<HTMLInputElement>) => {
    setStatus(null);
    setPasswordAgain(e.currentTarget.value);
  };

  const handler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setStatus(null);
    resetPassword(props.currentUser, code, password)
      .then(() => {
        setStatus("success");
        props.history.push("/signin");
      })
      .catch(() => {
        // TODO: show messages
        setStatus("warning");
      });
  };

  return (
    <div className="signup">
      <div className="container">
        <Alert type="success">
          {__("We have sent verification code via email.")}
        </Alert>
        <img src={Logo} alt="" className="logo" />
        <h1>{__("Change your password")}</h1>

        <div className="form">
          <label className="code">
            <h3>{__("Verification Code")}</h3>
            <input
              id={"code"}
              type={"text"}
              value={code}
              onChange={onCodeChange}
            />
          </label>
          <label className="password">
            <h3>{__("Password")}</h3>
            <input
              id={"password"}
              type={"password"}
              value={password}
              onChange={onPasswordChange}
              autoComplete={"new-password"}
            />
          </label>
          <label className="confirm-password">
            <h3>{__("Confirm password")}</h3>
            <input
              id={"confirm-password"}
              type={"password"}
              value={passwordAgain}
              onChange={onPasswordAgainChange}
              autoComplete={"new-password"}
            />
          </label>
          <p className="message">
            {__(
              "Make sure it's at least 15 characters OR at least 8 characters including a number and a lowercase letter."
            )}
          </p>
          <p>
            <Button
              variant="contained"
              color="primary"
              onClick={handler}
              disabled={
                password === "" ||
                passwordAgain === "" ||
                password !== passwordAgain
              }
            >
              {__("Change password")}
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

const mapStateToProps = (state: AppState) => ({
  currentUser: state.authSupport.currentUser || ""
});

export default connect(mapStateToProps)(Content);
