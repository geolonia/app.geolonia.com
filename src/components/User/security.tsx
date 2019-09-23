import React from "react";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";
import PersonIcon from "@material-ui/icons/Person";
import { __ } from "@wordpress/i18n";
import delay from "../../lib/promise-delay";
import { changePassword } from "../../auth";
import { CircularProgress } from "@material-ui/core";
import Alert from "../custom/Alert";

type State = {
  oldPassword: string;
  newPassword: string;
  newPasswordAgain: string;
  status: null | "requesting" | "success" | "failure";
};

type Props = {};

const linkStyle = {
  marginLeft: "1em"
} as React.CSSProperties;

const paragraphStyle = {
  marginTop: "1em"
} as React.CSSProperties;

export class Security extends React.Component<Props, State> {
  state = {
    oldPassword: "",
    newPassword: "",
    newPasswordAgain: "",
    status: null
  };

  setOldPassword = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ status: null, oldPassword: e.currentTarget.value });
  setNewPassword = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ status: null, newPassword: e.currentTarget.value });
  setNewPasswordAgain = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ status: null, newPasswordAgain: e.currentTarget.value });
  onUpdatePasswordClick = () => {
    const { oldPassword, newPassword } = this.state;
    this.setState({ status: "requesting" });
    delay(changePassword(oldPassword, newPassword), 500)
      .then(() => {
        this.setState({ status: "success" });
      })
      .catch(err => {
        console.error(err);
        this.setState({ status: "failure" });
      });
  };

  render() {
    const { oldPassword, newPassword, newPasswordAgain, status } = this.state;
    const isButtonEnabled = !!(
      oldPassword &&
      newPassword &&
      newPasswordAgain &&
      newPassword === newPasswordAgain
    );

    return (
      <>
        <Typography component="h2" className="module-title">
          Security
        </Typography>
        <TextField
          id="old-password"
          label="Old password"
          type="password"
          margin="normal"
          fullWidth={true}
          value={oldPassword}
          onChange={this.setOldPassword}
        />
        <TextField
          id="new-password"
          label="New password"
          type="password"
          margin="normal"
          fullWidth={true}
          value={newPassword}
          onChange={this.setNewPassword}
        />
        <TextField
          id="new-password-again"
          label="Confirm new password"
          type="password"
          margin="normal"
          fullWidth={true}
          value={newPasswordAgain}
          onChange={this.setNewPasswordAgain}
        />
        <Typography style={paragraphStyle} paragraph={true} component="p">
          <Button
            variant="contained"
            color="inherit"
            onClick={this.onUpdatePasswordClick}
            disabled={!isButtonEnabled}
          >
            {__("Update password")}
          </Button>
          <Link style={linkStyle} href="#">
            {__("I forgot my password")}
          </Link>
        </Typography>
        {status === "requesting" && (
          <p>
            <CircularProgress size={20}></CircularProgress>
          </p>
        )}
        {status === "success" && (
          <Alert type="success">{__("Password changed successfuly.")}</Alert>
        )}
        {status === "failure" && (
          <Alert type="warning">{__("Failed to change password.")}</Alert>
        )}
      </>
    );
  }
}

export default Security;
