import React from 'react';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import { __ } from '@wordpress/i18n';
import { changePassword } from '../../auth';
import { CircularProgress } from '@material-ui/core';
import Alert from '../custom/Alert';

// constant
import { messageDisplayDuration } from '../../constants';

type State = {
  oldPassword: string;
  newPassword: string;
  newPasswordAgain: string;
  status: null | 'requesting' | 'success' | 'failure';
};

type Props = {};

const linkStyle = {
  marginLeft: '1em',
} as React.CSSProperties;

const paragraphStyle = {
  marginTop: '1em',
} as React.CSSProperties;

export class Security extends React.Component<Props, State> {
  state = {
    oldPassword: '',
    newPassword: '',
    newPasswordAgain: '',
    status: null,
  };

  setOldPassword = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ status: null, oldPassword: e.currentTarget.value });
  setNewPassword = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ status: null, newPassword: e.currentTarget.value });
  setNewPasswordAgain = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ status: null, newPasswordAgain: e.currentTarget.value });

  reset = () =>
    this.setState({
      oldPassword: '',
      newPassword: '',
      newPasswordAgain: '',
    });

  onUpdatePasswordClick = () => {
    const { oldPassword, newPassword } = this.state;
    this.setState({ status: 'requesting' });

    changePassword(oldPassword, newPassword)
      .then(() => {
        this.setState({ status: 'success' });
        this.reset();
        setTimeout(
          () => this.setState({ status: null }),
          messageDisplayDuration,
        );
      })
      .catch(() => {
        this.setState({ status: 'failure' });
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
      <div className="grid-item-container">
        <Typography component="h2" className="module-title">
          {__('Security')}
        </Typography>
        <TextField
          id="old-password"
          label={__('Old password')}
          type="password"
          margin="normal"
          fullWidth={true}
          value={oldPassword}
          onChange={this.setOldPassword}
        />
        <TextField
          id="new-password"
          label={__('New password')}
          type="password"
          margin="normal"
          fullWidth={true}
          value={newPassword}
          onChange={this.setNewPassword}
        />
        <TextField
          id="new-password-again"
          label={__('Confirm new password')}
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
            {status === 'requesting' && (
              <CircularProgress size={16} style={{ marginRight: 8 }} />
            )}
            {__('Update password')}
          </Button>
          <Link style={linkStyle} href="/#/forgot-password">
            {__('I forgot my password')}
          </Link>
        </Typography>
        {status === 'success' && (
          <Alert type="success">{__('Password changed successfully.')}</Alert>
        )}
        {status === 'failure' && (
          <Alert type="warning">{__('Failed to change password.')}</Alert>
        )}
      </div>
    );
  }
}

export default Security;
