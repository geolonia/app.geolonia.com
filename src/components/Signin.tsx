import React from "react";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";

import "./Signin.scss";
import Logo from "./custom/logo.svg";
import Support from "./custom/Support";
import Alert from "./custom/Alert";
import { connect } from "react-redux";
import { AppState } from "../redux/store";
import { signin } from "../auth";
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
type Props = OwnProps & RouterProps & StateProps;

const messages = {
  success: __("Signin successed."),
  warning: __("Signin failed.")
};

const Content = (props: Props) => {
  const { signupUser } = props;

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

  const handleSignin = () => {
    setStatus("requesting");
    delay(signin(username, password), 500)
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
        {/* <Alert type="success">{__('Your password has been successfully updated.')}</Alert> */}
        <div className="form">
          <label className="username">
            <h2>{__("Username or email address")}</h2>
            <input
              type="text"
              value={username}
              onChange={onUsernameChange}
              tabIndex={100}
              autoComplete={'username'}
            />
          </label>
          <label className="password">
            <h2>{__("Password")}</h2>
            <input
              type="password"
              value={password}
              onChange={onPasswordChange}
              tabIndex={200}
              autoComplete={'current-password'}
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
            >
              {__("Sign in")}
            </Button>
          </p>
          {status === "requesting" && (
            <p>
              <CircularProgress size={20}></CircularProgress>
            </p>
          )}
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

Content.defaultProps = {};

const mapStateToProps = (state: AppState): StateProps => ({
  signupUser: state.authSupport.currentUser
});
const ConnectedContent = connect(mapStateToProps)(Content);

export default ConnectedContent;
