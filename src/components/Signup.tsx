import React from "react";
import Button from "@material-ui/core/Button";

import Support from "./custom/Support";
import Languages from "./custom/languages";
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
import parseCognitoSignupError from "../lib/cognito/parse-error";

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

  const handleSignup = (e: React.MouseEvent | void) => {
    e && e.preventDefault();
    setStatus("requesting");
    delay(signUp(username, email, password), 500)
      .then(result => {
        setMessage(__("Signup successed."));
        setStatus("success");
        props.setCurrentUser(result.user.getUsername());
        props.history.push("/verify");
      })
      .catch(err => {
        setMessage(parseCognitoSignupError(err || { code: "" }));
        setStatus("warning");
      });
  };

  const usernameIsValid = username !== "";
  const emailIsValid = email !== "";
  const passwordIsValid = password !== "";
  const buttonDisabled = !usernameIsValid || !emailIsValid || !passwordIsValid;

  const onPasswordKeyDown = (e: React.KeyboardEvent) => {
    // enter
    e.keyCode === 13 && !buttonDisabled && handleSignup();
  };

  return (
    <div className="signup">
      {status && status !== "requesting" && (
        <Alert type={status}>{message}</Alert>
      )}
      <div className="container">
        <img src={Logo} alt="" className="logo" />
        <h1>{__("Welcome to Geolonia")}</h1>
        <h2>{__("Create your account")}</h2>
        <p>
          {__(
            "We are currently private beta. Sign Up is restricted to invited users."
          )}
        </p>
        <form className="form">
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
              "Make sure at least 8 characters including a number and a lowercase letter."
            )}
          </p>

          <p>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSignup}
              disabled={buttonDisabled}
              type={"submit"}
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
        </form>

        <div className="support-container">
          <Languages />
          <hr />
          <Support />
        </div>
      </div>
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
