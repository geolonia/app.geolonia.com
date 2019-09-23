import React from "react";
import Button from "@material-ui/core/Button";

import Support from "./custom/Support";
import "./ResetPassword.scss";
import Logo from "./custom/logo.svg";
import Alert from "./custom/Alert";
import { resetPassword } from "../auth";

import { sprintf, __ } from "@wordpress/i18n";

type OwnProps = {};
type RouterProps = {
  history: {
    push: (path: string) => void;
  };
};

type Props = OwnProps & RouterProps;

const Content = (props: Props) => {
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const [status, setStatus] = React.useState<null | "success" | "warning">(
    null
  );
  const onPasswordChange = (e: React.FormEvent<HTMLInputElement>) => {
    setStatus(null);
    setPassword(e.currentTarget.value);
  };

  const handler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setStatus(null);
    resetPassword(code, password)
      .then(() => {
        setStatus("success");
        props.history.push("/");
      })
      .catch(err => {
        setStatus("warning");
        console.error(err);
      });
  };

  return (
    <div className="signup">
      <div className="container">
        <img src={Logo} alt="" className="logo" />
        <h1>{__("Change your password")}</h1>

        <div className="form">
          <label className="password">
            <h3>{__("Password")}</h3>
            <input type="text" value={password} onChange={onPasswordChange} />
          </label>
          <label className="confirm-password">
            <h3>{__("Confirm password")}</h3>
            <input type="text" />
          </label>
          <p className="message">
            {__(
              "Make sure it's at least 15 characters OR at least 8 characters including a number and a lowercase letter."
            )}
          </p>
          <p>
            <Button variant="contained" color="primary" onClick={handler}>
              {__("Send password reset email")}
            </Button>
          </p>
        </div>

        <div className="support-container">
          <Support />
        </div>
      </div>
    </div>
  );
};

Content.defaultProps = {};

export default Content;
