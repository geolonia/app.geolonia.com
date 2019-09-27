import React from "react";
import Button from "@material-ui/core/Button";

import Support from "./custom/Support";
import "./ResetPassword.scss";
import Logo from "./custom/logo.svg";
import { resetPassword } from "../auth";

import {__} from "@wordpress/i18n";

type OwnProps = {};
type RouterProps = {
  history: {
    push: (path: string) => void;
  };
};

type Props = OwnProps & RouterProps;

const Content = (props: Props) => {
  const [password, setPassword] = React.useState("");
  const [code] = React.useState("");
  const setStatus = React.useState<null | "success" | "warning">(
    null
  )[1];

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
            <input type="password" value={password} onChange={onPasswordChange} autoComplete={'new-password'} />
          </label>
          <label className="confirm-password">
            <h3>{__("Confirm password")}</h3>
            <input type="password" autoComplete={'new-password'} />
          </label>
          <p className="message">
            {__(
              "Make sure it's at least 15 characters OR at least 8 characters including a number and a lowercase letter."
            )}
          </p>
          <p>
            <Button variant="contained" color="primary" onClick={handler}>
              {__("Change password")}
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
