import "./ResetPassword.scss";

import React from "react";
import Button from "@material-ui/core/Button";
import Support from "./custom/Support";
import Logo from "./custom/logo.svg";
import { CircularProgress, Link } from "@material-ui/core";
import Alert from "./custom/Alert";

// API
import { resetPassword } from "../auth";

// Utils
import { __ } from "@wordpress/i18n";
import { connect } from "react-redux";
import queryString from "query-string";

// Types
import { AppState } from "../types";
import { pageTransitionInterval } from "../constants";
import estimateLanguage from "../lib/estimate-language";

const Content = () => {
  const parsed = queryString.parse(window.location.search);
  const qsusername = parsed.username as string;

  const [code, setCode] = React.useState("");
  const [username, setUsername] = React.useState(qsusername || "");
  const [password, setPassword] = React.useState("");
  const [passwordAgain, setPasswordAgain] = React.useState("");
  const [status, setStatus] = React.useState<
    null | "requesting" | "success" | "warning"
  >(null);

  const onCodeChange = (e: React.FormEvent<HTMLInputElement>) => {
    setStatus(null);
    setCode(e.currentTarget.value);
  };
  const onUsernameChange = (e: React.FormEvent<HTMLInputElement>) => {
    setStatus(null);
    setUsername(e.currentTarget.value);
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
    event && event.preventDefault();
    setStatus(null);
    resetPassword(username, code, password)
      .then(() => {
        setStatus("success");
        setTimeout(() => {
          window.location.href = `/?lang=${estimateLanguage()}&username=${username}&reset=true#/signin`;
        }, pageTransitionInterval);
      })
      .catch(error => {
        console.log(error);
        // TODO: show messages
        setStatus("warning");
      });
  };

  return (
    <div className="signup">
      <div className="container">
        <img src={Logo} alt="" className="logo" />
        <h1>{__("Change your password")}</h1>
        {!!qsusername && (
          <Alert type="success">
            {__(
              "Please check your email and enter the verification code like 123456 with new password."
            )}
          </Alert>
        )}

        <form className="form">
          <label className="code">
            <h3>{__("Verification Code")}</h3>
            <input
              id={"code"}
              type={"text"}
              value={code}
              onChange={onCodeChange}
            />
          </label>
          {!qsusername && (
            <label className="username">
              <h3>{__("Username")}</h3>
              <input
                id={"username"}
                type={"text"}
                value={username}
                onChange={onUsernameChange}
              />
            </label>
          )}
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
              "Make sure at least 8 characters including a number and a lowercase letter."
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
              type={"submit"}
            >
              {__("Change password")}
            </Button>
          </p>
          <p>
            <Link href="#/forgot-password" tabIndex={400}>
              {__("Resend verification code.")}
            </Link>
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

const mapStateToProps = (state: AppState) => ({
  currentUser: state.authSupport.currentUser || ""
});

export default connect(mapStateToProps)(Content);
