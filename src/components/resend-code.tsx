import React from "react";
import Button from "@material-ui/core/Button";

import Support from "./custom/Support";
import Logo from "./custom/logo.svg";
import Alert from "./custom/Alert";
import { requestVerificationCode } from "../auth";
import StatusIndication from "./custom/status-indication";
import delay from "../lib/promise-delay";

import { __ } from "@wordpress/i18n";
import estimateLanguage from "../lib/estimate-language";
import { pageTransitionInterval } from "../constants";
import { parseResendError as parseCognitoResendError } from "../lib/cognito/parse-error";
import queryString from "query-string";

const ResendCode = () => {
  const parsed = queryString.parse(window.location.search);
  const qsusername = parsed.username as string;

  const [username, setUsername] = React.useState(qsusername || "");
  const [status, setStatus] = React.useState<
    null | "requesting" | "success" | "warning"
  >(null);
  const [message, setMessage] = React.useState("");

  const onUsernameChange = (e: React.FormEvent<HTMLInputElement>) => {
    setStatus(null);
    setUsername(e.currentTarget.value);
  };

  const handleRequestResend = (
    e: React.MouseEvent<HTMLButtonElement> | void
  ) => {
    e && e.preventDefault();
    setStatus("requesting");
    delay(requestVerificationCode(username), 500)
      .then(() => {
        setStatus("success");
        setTimeout(() => {
          window.location.href = `/?lang=${estimateLanguage()}&&username=${encodeURIComponent(
            username
          )}#/verify`;
        }, pageTransitionInterval);
      })
      .catch(err => {
        setMessage(parseCognitoResendError(err));
        setStatus("warning");
      });
  };

  return (
    <div className="signup">
      <div className="container">
        <img src={Logo} alt="" className="logo" />
        <h1>{__("Request a new verification code")}</h1>
        {status === "warning" && <Alert type={status}>{message}</Alert>}
        <form className="form">
          <label className="username">
            <h3>{__("Username")}</h3>
            <input
              id={"username"}
              type={"text"}
              value={username}
              onChange={onUsernameChange}
            />
          </label>

          <p>
            <Button
              variant="contained"
              color="primary"
              onClick={handleRequestResend}
              disabled={username.trim() === ""}
              type={"submit"}
            >
              {__("request send")}
            </Button>
          </p>
          <StatusIndication status={status}></StatusIndication>
        </form>

        <div className="support-container">
          <Support />
        </div>
      </div>
    </div>
  );
};

export default ResendCode;
