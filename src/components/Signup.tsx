import React from "react";
import Button from "@material-ui/core/Button";

import Support from "./custom/Support";
import "./Signup.scss";
import Logo from "./custom/logo.svg";
import Alert from "./custom/Alert";
import { signUp } from "../auth";
import Redux from "redux";
import { connect } from "react-redux";
import { createActions } from "../redux/actions/auth-support";
import { CircularProgress } from "@material-ui/core";
import delay from "../lib/promise-delay";
import { __ } from "@wordpress/i18n";
import Interweave from "interweave";

type OwnProps = {};
type RouterProps = {
  history: {
    push: (path: string) => void;
  };
};
type StateProps = {};
type DispatchProps = {
  setCurrentUser: (user: string) => void;
};

type Props = OwnProps & RouterProps & StateProps & DispatchProps;

const isPasswordStrongEnough = (password: string) => {
  if (password.length > 14) {
    return true;
  } else if (
    password.length > 7 &&
    password.split("").some(char => /^[0-9]$/.test(char)) &&
    password.split("").some(char => /^[a-z]$/.test(char)) &&
    password.split("").some(char => /^[A-Z]$/.test(char))
  ) {
    return true;
  } else {
    return false;
  }
};

type Status = null | "requesting" | "success" | "warning";

const Content = (props: Props) => {
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [status, setStatus] = React.useState<Status>(null);
  const [message, setMessage] = React.useState("");

  const onUsernameChange = (e: React.FormEvent<HTMLInputElement>) => {
    setStatus(null);
    setUsername(e.currentTarget.value);
  };
  const onEmailChange = (e: React.FormEvent<HTMLInputElement>) => {
    setStatus(null);
    setEmail(e.currentTarget.value);
  };
  const onPasswordChange = (e: React.FormEvent<HTMLInputElement>) => {
    setStatus(null);
    setPassword(e.currentTarget.value);
  };

  const handleSignup = () => {
    setStatus("requesting");
    delay(signUp(username, email, password), 500)
      .then(result => {
        setMessage(__("Signup successed."));
        setStatus("success");
        props.setCurrentUser(result.user.getUsername());
        props.history.push("/verify");
      })
      .catch(err => {
        // Cognito specific
        if (
          err.code === "UsernameExistsException" ||
          err.code === "UserLambdaValidationException"
        ) {
          setMessage(
            __("Signup failed. You cannot use the username or email.")
          );
        } else if (err.code === "InvalidParameterException") {
          setMessage(__("Invalid username or email address."));
        } else {
          __("Signup failed. You cannot use the username or email.")
        }
        setStatus("warning");
      });
  };

  const buttonDisabled =
  username === "" || email === "" || !isPasswordStrongEnough(password);

  const onPasswordKeyDown = (e: React.KeyboardEvent) => {
    // enter
    e.keyCode === 13 && !buttonDisabled && handleSignup()
  }

  return (
    <div className="signup">
      <div className="container">
        <img src={Logo} alt="" className="logo" />
        <h1>{__("Welcome to Geolonia")}</h1>
        <h2>{__("Create your account")}</h2>

        <div className="form">
          <label className="username">
            <h3>{__("Username")}</h3>
            <input
              id={"username"}
              type={"text"}
              value={username}
              onChange={onUsernameChange}
            />
            <p className="message">
              {__("Username cannot be modified later.")}
            </p>
          </label>
          <label className="email">
            <h3>{__("Email address")}</h3>
            <input
              id={"email"}
              type={"text"}
              value={email}
              onChange={onEmailChange}
            />
          </label>
          <label className="password">
            <h3>{__("Password")}</h3>
            <input
              id={"password"}
              type={"password"}
              value={password}
              onChange={onPasswordChange}
              onKeyDown={onPasswordKeyDown}
              autoComplete={"new-password"}
            />
          </label>
          <p className="message">
            {__(
              "Make sure it's at least 15 characters OR at least 8 characters including a number and a lowercase letter."
            )}
          </p>

          <p>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSignup}
              disabled={buttonDisabled}
            >
              {__("Sign up")}
            </Button>
          </p>
          {status === "requesting" && (
            <div style={{ marginTop: ".75em" }}>
              <CircularProgress size={20} />
            </div>
          )}
          <p className="message">
            <Interweave
              content={__(
                'By signing up to Geolonia, you agree to our <a href="https://geolonia.com/terms" class="MuiTypography-colorPrimary">Terms of service</a> and <a class="MuiTypography-colorPrimary" href="https://geolonia.com/privacy">Privacy policy</a>.'
              )}
            />
          </p>
        </div>

        <div className="support-container">
          <Support />
        </div>
      </div>
      {status && status !== "requesting" && (
        <Alert type={status}>{message}</Alert>
      )}
    </div>
  );
};

const mapStateToProps = (): StateProps => ({});
const mapDispatchToProps = (dispatch: Redux.Dispatch): DispatchProps => ({
  setCurrentUser: (user: string) => dispatch(createActions.setCurrentUser(user))
});
const ConnectedContent = connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(Content);

export default ConnectedContent;
