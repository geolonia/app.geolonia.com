import React from "react";

import Button from "@material-ui/core/Button";
import { __ } from "@wordpress/i18n";

import Support from "./custom/Support";
import "./ForgotPassword.scss";
import Logo from "./custom/logo.svg";
import { sendVerificationEmail } from "../auth";
import delay from "../lib/promise-delay";
import Alert from "./custom/Alert";
import estimateLanguage from "../lib/estimate-language";
import { pageTransitionInterval } from "../constants";
import StatusIndication from "./custom/status-indication";
import { parseForgotPasswordError as parseCognitoForgotPasswordError } from "../lib/cognito/parse-error";

type OwnProps = {};
type RouterProps = {
  history: {
    push: (path: string) => void;
  };
};
type DispatchProps = {};
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
    delay(sendVerificationEmail(email), 500)
      .then(() => {
        setStatus("success");
        setTimeout(() => {
          window.location.href = `/?lang=${estimateLanguage()}&username=${encodeURIComponent(
            email
          )}#/reset-password`;
        }, pageTransitionInterval);
      })
      .catch(error => {
        setMessage(parseCognitoForgotPasswordError(error));
        setStatus("warning");
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
            <h3>{__("Username or email")}</h3>
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
