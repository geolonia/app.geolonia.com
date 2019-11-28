import "./Signin.scss";

import React from "react";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Logo from "./custom/logo.svg";
import Support from "./custom/Support";
import Alert from "./custom/Alert";
import { CircularProgress } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";

// Utils
import delay from "../lib/promise-delay";
import { __ } from "@wordpress/i18n";

// Types
import { AppState } from "../types";

// API
import { signin } from "../auth";

// Redux
import Redux from "redux";
import { createActions } from "../redux/actions/auth-support";
import { connect } from "react-redux";

type OwnProps = {};
type RouterProps = {
  history: {
    push: (path: string) => void;
  };
};
type StateProps = {
  serverTrouble: boolean;
  signupUser?: string;
};
type DispatchProps = {
  setAccessToken: (accessToken: string) => void;
};
type Props = OwnProps & RouterProps & StateProps & DispatchProps;

const messages = {
  success: __("Signin successed."),
  warning: __("Signin failed.")
};

const Content = (props: Props) => {
  const { signupUser, serverTrouble } = props;

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [status, setStatus] = React.useState<
    null | "requesting" | "success" | "warning"
  >(null);

  React.useEffect(() => {
    if (signupUser && username === "") {
      setUsername(signupUser);
    }
  }, [signupUser, username]);

  const onUsernameChange = (e: React.FormEvent<HTMLInputElement>) => {
    setStatus(null);
    setUsername(e.currentTarget.value);
  };

  const onPasswordChange = (e: React.FormEvent<HTMLInputElement>) => {
    setStatus(null);
    setPassword(e.currentTarget.value);
  };

  const buttonDisabled = username === "" || password === "";

  const handleSignin = () => {
    setStatus("requesting");
    delay(signin(username, password), 250)
      .then(() => {
        setStatus("success");
        // Force reloadading and use componentDidMount of AuthContainer to get session
        setTimeout(() => (window.location.href = "/"), 250);
      })
      .catch(() => {
        // TODO: show messages
        setStatus("warning");
      });
  };

  return (
    <div className="signin">
      <div className="container">
        <img src={Logo} alt="" className="logo" />
        <h1>{__("Sign in to Geolonia")}</h1>
        {signupUser ? (
          <Alert type="success">
            {__(
              "Your account has been successfully verified. Please enter your password again and sign in to your account."
            )}
          </Alert>
        ) : status === "warning" ? (
          <Alert type="warning">{messages.warning}</Alert>
        ) : null}
        {serverTrouble && (
          <Alert type={"warning"}>
            {__("Oops, the server seems not to be responding correctly.")}
          </Alert>
        )}
        <div className="form">
          <label className="username">
            <h2>{__("Username or email address")}</h2>
            <input
              type="text"
              value={username}
              onChange={onUsernameChange}
              tabIndex={100}
              autoComplete={"username"}
            />
          </label>
          <label className="password">
            <h2>{__("Password")}</h2>
            <input
              type={"password"}
              value={password}
              onChange={onPasswordChange}
              tabIndex={200}
              autoComplete={"current-password"}
            />
          </label>
          <p className="forgot-password">
            <Link href="#/forgot-password" tabIndex={400}>
              {__("Forgot password?")}
            </Link>
          </p>
          <p>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSignin}
              tabIndex={300}
              disabled={buttonDisabled}
            >
              {__("Sign in")}
            </Button>
          </p>
          {status === "requesting" ? (
            <div style={{ marginTop: ".75em" }}>
              <CircularProgress size={20} />
            </div>
          ) : status === "success" ? (
            <div style={{ marginTop: ".75em" }}>
              <CheckIcon fontSize={"default"} color={"primary"} />
            </div>
          ) : null}
        </div>

        <p>
          {__("New to Geolonia?")}{" "}
          <Link href="#/signup" tabIndex={500}>
            {__("Create an account.")}
          </Link>
        </p>

        <div className="support-container">
          <Support />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: AppState): StateProps => ({
  serverTrouble: state.authSupport.hasTrouble,
  signupUser: state.authSupport.currentUser
});
const mapDispatchToProps = (dispatch: Redux.Dispatch) => ({
  setAccessToken: (accessToken: string) =>
    dispatch(createActions.setAccessToken(accessToken))
});
const ConnectedContent = connect(mapStateToProps, mapDispatchToProps)(Content);

export default ConnectedContent;
