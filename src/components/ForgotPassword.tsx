import React from "react";

import Button from "@material-ui/core/Button";
import { __ } from "@wordpress/i18n";

import Support from "./custom/Support";
import "./ForgotPassword.scss";
import Logo from "./custom/logo.svg";

type Props = {};

const Content = (props: Props) => {
  const handleSignup = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {};

  return (
    <div className="signup">
      <div className="container">
        <img src={Logo} alt="" className="logo" />
        <h1>{__("Reset your password")}</h1>

        <div className="form">
          <label className="email">
            <h3>{__("Email address")}</h3>
            <input type="text" />
          </label>
          <p className="message">
            {__("We will send you a verification code to reset your password.")}
          </p>
          <p>
            <Button variant="contained" color="primary" onClick={handleSignup}>
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
