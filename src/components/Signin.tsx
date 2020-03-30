import "./Signin.scss";

import React from "react";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Logo from "./custom/logo.svg";
import Support from "./custom/Support";
import Alert from "./custom/Alert";
import StatusIndication from "./custom/status-indication";

// Utils
import delay from "../lib/promise-delay";
import queryString from "query-string";
import { __ } from "@wordpress/i18n";

// Types
import { AppState } from "../types";

// API
import { signin } from "../auth";

// Redux
import Redux from "redux";
import { createActions } from "../redux/actions/auth-support";
import { connect } from "react-redux";

// constants
import { pageTransitionInterval } from "../constants";

type OwnProps = {};
type RouterProps = {
  history: {
    push: (path: string) => void;
  };
};
type StateProps = {
  serverTrouble: boolean;
};
type DispatchProps = {
  setAccessToken: (accessToken: string) => void;
};
type Props = OwnProps & RouterProps & StateProps & DispatchProps;

const Content = (props: Props) => {
  const { serverTrouble } = props;

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
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
      const passwordInput = document.getElementById("password");
      passwordInput && passwordInput.focus();
    }
  }, [hasQueryStringUsername, parsed.username, username]);

  const onUsernameChange = (e: React.FormEvent<HTMLInputElement>) => {
    setStatus(null);
    setUsername(e.currentTarget.value);
  };

  const onPasswordChange = (e: React.FormEvent<HTMLInputElement>) => {
    setStatus(null);
    setPassword(e.currentTarget.value);
  };

  const buttonDisabled = username === "" || password === "";

  const handleSignin = (e: React.MouseEvent | void) => {
    e && e.preventDefault();
    setStatus("requesting");
    delay(signin(username, password), 250)
      .then(() => {
        setStatus("success");
        // Force reloadading and use componentDidMount of AuthContainer to get session
        setTimeout(() => (window.location.href = "/"), pageTransitionInterval);
      })
      .catch(error => {
        setStatus("warning");
        if (
          error &&
          (error.code === "UserNotFoundException" ||
            error.code === "NotAuthorizedException")
        ) {
          setMessage(__("Incorrect username, email address or password."));
        } else {
          setMessage(__("Unknown error."));
        }
      });
  };
  const onPasswordKeyDown = (e: React.KeyboardEvent) => {
    // enter
    e.keyCode === 13 && !buttonDisabled && handleSignin();
  };

  return (
    <div className="signin">
      <div className="container">
        <img src={Logo} alt="" className="logo" />
        <h1>{__("Sign in to Geolonia")}</h1>
        {hasQueryStringUsername ? (
          <Alert type="success">
            {__(
              "Your account has been successfully verified. Please enter your password again and sign in to your account."
            )}
          </Alert>
        ) : status === "warning" ? (
          <Alert type="warning">{message}</Alert>
        ) : null}
        {serverTrouble && (
          <Alert type={"warning"}>
            {__("Oops, the server seems not to be responding correctly.")}
          </Alert>
        )}
        <form className="form">
          <label className="username">
            <h2>{__("Username or email address")}</h2>
            <input
              id={"username"}
              type={"text"}
              value={username}
              onChange={onUsernameChange}
              tabIndex={100}
              autoComplete={"username"}
            />
          </label>
          <label className="password">
            <h2>{__("Password")}</h2>
            <input
              id={"password"}
              type={"password"}
              value={password}
              onChange={onPasswordChange}
              onKeyDown={onPasswordKeyDown}
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
              id={"signin"}
              variant="contained"
              color="primary"
              onClick={handleSignin}
              tabIndex={300}
              disabled={buttonDisabled}
              type={"submit"}
            >
              {__("Sign in")}
            </Button>
          </p>
          <StatusIndication status={status}></StatusIndication>
        </form>

        <p>
          {__("New to Geolonia?")}
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
  serverTrouble: state.authSupport.hasTrouble
});
const mapDispatchToProps = (dispatch: Redux.Dispatch) => ({
  setAccessToken: (accessToken: string) =>
    dispatch(createActions.setAccessToken(accessToken))
});
const ConnectedContent = connect(mapStateToProps, mapDispatchToProps)(Content);

export default ConnectedContent;
