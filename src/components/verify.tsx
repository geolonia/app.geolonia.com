import React from "react";
import Button from "@material-ui/core/Button";

import Support from "./custom/Support";
import "./Signup.scss";
import Logo from "./custom/logo.svg";
import Alert from "./custom/Alert";
import { verify } from "../auth";
import StatusIndication from "./custom/status-indication";
import delay from "../lib/promise-delay";

import { __ } from "@wordpress/i18n";
import queryString from "query-string";
import estimateLanguage from "../lib/estimate-language";
import { pageTransitionInterval } from "../constants";
import { parseVerifyError as parseCognitoVerifyError } from "../lib/cognito/parse-error";

const Content = () => {
  const [username, setUsername] = React.useState("");
  const [code, setCode] = React.useState("");
  const [status, setStatus] = React.useState<
    null | "requesting" | "success" | "warning"
  >(null);
  const [message, setMessage] = React.useState("");

  const parsed = queryString.parse(window.location.search);
  const hasQueryStringUsername =
    !!parsed.username && typeof parsed.username === "string";

  React.useEffect(() => {
    if (hasQueryStringUsername && username === "") {
      setUsername(parsed.username as string);
      const codeInput = document.getElementById("code");
      codeInput && codeInput.focus();
    }
  }, [hasQueryStringUsername, parsed.username, username]);

  const buttonDisabled = username === "" || !/^[0-9]{6}$/g.test(code);

  const onUsernameChange = (e: React.FormEvent<HTMLInputElement>) => {
    setStatus(null);
    setUsername(e.currentTarget.value);
  };
  const onCodeChange = (e: React.FormEvent<HTMLInputElement>) => {
    setStatus(null);
    const nextCode = e.currentTarget.value;
    if (nextCode.length < 7) {
      setCode(e.currentTarget.value);
    }
  };

  const handleVerify = (e: React.MouseEvent<HTMLButtonElement> | void) => {
    e && e.preventDefault();
    setStatus("requesting");
    delay(verify(username, code), 500)
      .then(() => {
        setStatus("success");
        setTimeout(() => {
          window.location.href = `/?lang=${estimateLanguage()}&&username=${encodeURIComponent(
            username
          )}#/signin`;
        }, pageTransitionInterval);
      })
      .catch(err => {
        setMessage(parseCognitoVerifyError(err));

        setStatus("warning");
      });
  };

  return (
    <div className="signup">
      <div className="container">
        <img src={Logo} alt="" className="logo" />
        <h1>{__("Welcome to Geolonia")}</h1>
        <h2>{__("Verify your account")}</h2>
        {status === "warning" && <Alert type={status}>{message}</Alert>}
        {username && !status && (
          <Alert type="success">
            {__(
              "Please check your email and enter the verification code like 123456."
            )}
          </Alert>
        )}
        <form className="form">
          <label className="username">
            <h3>{__("Username")}</h3>
            <input
              id={"username"}
              type={"text"}
              value={username}
              onChange={onUsernameChange}
              disabled={hasQueryStringUsername}
            />
          </label>
          <label className="text">
            <h3>{__("Verification code")}</h3>
            <input
              id={"code"}
              type={"text"}
              value={code}
              onChange={onCodeChange}
            />
          </label>

          <p>
            <Button
              variant="contained"
              color="primary"
              onClick={handleVerify}
              disabled={buttonDisabled}
              type={"submit"}
            >
              {__("Verify")}
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

export default Content;
