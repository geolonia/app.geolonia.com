import React from "react";
import Button from "@material-ui/core/Button";

import Support from "./custom/Support";
import "./Signup.scss";
import Logo from "./custom/logo.svg";
import Alert from "./custom/Alert";
import { connect } from "react-redux";
import { AppState } from "../redux/store";
import { verify } from "../auth";

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
  success: "Verification successed.",
  warning: "Verification failed."
};

const Content = (props: Props) => {
  const { signupUser } = props;

  const [username, setUsername] = React.useState("");
  const [code, setCode] = React.useState("");
  const [status, setStatus] = React.useState<null | "success" | "warning">(
    null
  );

  React.useEffect(() => {
    if (signupUser && username === "") {
      setUsername(signupUser);
    }
  }, [signupUser, username]);

  const onUsernameChange = (e: React.FormEvent<HTMLInputElement>) => {
    setStatus(null);
    setUsername(e.currentTarget.value);
  };
  const onCodeChange = (e: React.FormEvent<HTMLInputElement>) => {
    setStatus(null);
    setCode(e.currentTarget.value);
  };

  const handleVerify = () => {
    setStatus(null);
    verify(username, code)
      .then(() => {
        setStatus("success");
        setTimeout(() => props.history.push("/signin"), 2000);
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
        <h1>{__("Welcome to Geolonia")}</h1>
        <h2>{__("Verify your account")}</h2>

        <div className="form">
          <label className="username">
            <h3>{__("Username")}</h3>
            <input type="text" value={username} onChange={onUsernameChange} />
          </label>
          <label className="text">
            <h3>{__("Verification code")}</h3>
            <input type="text" value={code} onChange={onCodeChange} />
          </label>

          <p>
            <Button variant="contained" color="primary" onClick={handleVerify}>
              {__("Verify")}
            </Button>
          </p>
        </div>

        <div className="support-container">
          <Support />
        </div>
      </div>
      {status && <Alert type={status}>{messages[status]}</Alert>}
    </div>
  );
};

Content.defaultProps = {};

const mapStateToProps = (state: AppState): StateProps => ({
  signupUser: state.authSupport.currentUser
});
const ConnectedContent = connect(mapStateToProps)(Content);

export default ConnectedContent;
