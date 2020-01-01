import React from "react";
import Button from "@material-ui/core/Button";

import Support from "./custom/Support";
import "./Signup.scss";
import Logo from "./custom/logo.svg";
import Alert from "./custom/Alert";
import { connect } from "react-redux";
import { AppState } from "../types";
import { verify } from "../auth";
import { CircularProgress } from "@material-ui/core";
import delay from "../lib/promise-delay";

import { __ } from "@wordpress/i18n";

type OwnProps = {};
type RouterProps = {
  history: {
    push: (path: string) => void;
  };
};
type StateProps = {
  signupUser?: string;
};
type DispatchProps = {};
type Props = OwnProps & RouterProps & StateProps & DispatchProps;

const messages = {
  success: "Verification successed.",
  warning: "Verification failed."
};

const Content = (props: Props) => {
  const { signupUser } = props;

  const [username, setUsername] = React.useState("");
  const [code, setCode] = React.useState("");
  const [status, setStatus] = React.useState<
    null | "requesting" | "success" | "warning"
  >(null);

  React.useEffect(() => {
    if (signupUser && username === "") {
      setUsername(signupUser);
    }
  }, [signupUser, username]);

  // TODO: we can enhance code validation with regex
  const buttonDisabled = username === "" || code === "";

  const onUsernameChange = (e: React.FormEvent<HTMLInputElement>) => {
    setStatus(null);
    setUsername(e.currentTarget.value);
  };
  const onCodeChange = (e: React.FormEvent<HTMLInputElement>) => {
    setStatus(null);
    setCode(e.currentTarget.value);
  };

  const handleVerify = () => {
    setStatus("requesting");
    delay(verify(username, code), 500)
      .then(() => {
        setStatus("success");
        props.history.push("/signin");
      })
      .catch(err => {
        setStatus("warning");
      });
  };

  return (
    <div className="signup">
      <div className="container">
        <img src={Logo} alt="" className="logo" />
        <h1>{__("Welcome to Geolonia")}</h1>
        <h2>{__("Verify your account")}</h2>

        <div className="form">
          <label className="username">
            <h3>{__("Username")}</h3>
            <input
              id={"username"}
              type={"text"}
              value={username}
              onChange={onUsernameChange}
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
            >
              {__("Verify")}
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
      {username && !status && (
        <Alert type="success">
          {__(
            "Please check your email and enter the verification code like 123456."
          )}
        </Alert>
      )}
      {status && status !== "requesting" && (
        <Alert type={status}>{messages[status]}</Alert>
      )}
    </div>
  );
};

const mapStateToProps = (state: AppState): StateProps => ({
  signupUser: state.authSupport.currentUser
});
const ConnectedContent = connect(mapStateToProps)(Content);

export default ConnectedContent;
