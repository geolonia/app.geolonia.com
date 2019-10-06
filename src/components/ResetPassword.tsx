import React from "react";
import Button from "@material-ui/core/Button";
import Support from "./custom/Support";
import "./ResetPassword.scss";
import Logo from "./custom/logo.svg";
import { resetPassword } from "../auth";
import { __ } from "@wordpress/i18n";
import { CircularProgress } from "@material-ui/core";
import delay from "../lib/promise-delay";
import { AppState } from "../redux/store";
import { connect } from "react-redux";
import Alert from "./custom/Alert";

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
    delay(resetPassword(props.currentUser, code, password), 500)
      .then(() => {
        setStatus("success");
        props.history.push("/signin");
      })
      .catch(err => {
        setStatus("warning");
        console.error(err);
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
            <input type="text" value={code} onChange={onCodeChange} />
          </label>
          <label className="password">
            <h3>{__("Password")}</h3>
            <input
              type="password"
              value={password}
              onChange={onPasswordChange}
              autoComplete={"new-password"}
            />
          </label>
          <label className="confirm-password">
            <h3>{__("Confirm password")}</h3>
            <input type="password" autoComplete={"new-password"} />
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
          {status === "requesting" && (
            <p>
              <CircularProgress size={20} />
            </p>
          )}
        </div>

        <div className="support-container">
          <Support />
        </div>
      </div>
    </div>
  );
};

Content.defaultProps = {};

const mapStateToProps = (state: AppState) => ({
  currentUser: state.authSupport.currentUser || ""
});

export default connect(mapStateToProps)(Content);
