import React from "react";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";
import PersonIcon from "@material-ui/icons/Person";

type State = {
  oldPassword: string;
  newPassword: string;
  newPasswordAgain: string;
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
    newPasswordAgain: ""
  };

  setOldPassword = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ oldPassword: e.currentTarget.value });
  setNewPassword = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ newPassword: e.currentTarget.value });
  setNewPasswordAgain = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ newPasswordAgain: e.currentTarget.value });
  onUpdatePasswordClick = () => console.log(this.state);

  render() {
    const { oldPassword, newPassword, newPasswordAgain } = this.state;

    return (
      <>
        <Typography component="h2" className="module-title">
          Security
        </Typography>
        <TextField
          id="standard-name"
          label="Old password"
          type="password"
          margin="normal"
          fullWidth={true}
          value={oldPassword}
          onChange={this.setOldPassword}
        />
        <TextField
          id="standard-name"
          label="New password"
          type="password"
          margin="normal"
          fullWidth={true}
          value={newPassword}
          onChange={this.setNewPassword}
        />
        <TextField
          id="standard-name"
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
          >
            Update password
          </Button>
          <Link style={linkStyle} href="#">
            I forgot my password
          </Link>
        </Typography>
      </>
    );
  }
}

export default Security;
