import './ResetPassword.scss';

import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Support from './custom/Support';
import Logo from './custom/logo.svg';
import { Link } from '@material-ui/core';
import Alert from './custom/Alert';
import { parseResetPasswordError as parseCognitoResetPasswordError } from '../lib/cognito/parse-error';

// API
import { resetPassword } from '../auth';

// Utils
import { __ } from '@wordpress/i18n';
import { connect } from 'react-redux';
import queryString from 'query-string';
import delay from '../lib/promise-delay';

// Types
import { pageTransitionInterval } from '../constants';
import estimateLanguage from '../lib/estimate-language';
import StatusIndication from './custom/status-indication';

const Content = () => {
  const parsed = queryString.parse(window.location.search);
  const qsusername = parsed.username as string;

  const [code, setCode] = useState('');
  const [username, setUsername] = useState(qsusername || '');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [status, setStatus] = useState<
    null | 'requesting' | 'success' | 'warning'
  >(null);
  const [message, setMessage] = useState('');

  const onCodeChange = (e: React.FormEvent<HTMLInputElement>) => {
    setStatus(null);
    setCode(e.currentTarget.value);
  };
  const onUsernameChange = (e: React.FormEvent<HTMLInputElement>) => {
    setStatus(null);
    setUsername(e.currentTarget.value);
  };
  const onPasswordChange = (e: React.FormEvent<HTMLInputElement>) => {
    setStatus(null);
    setPassword(e.currentTarget.value);
  };
  const onPasswordAgainChange = (e: React.FormEvent<HTMLInputElement>) => {
    setStatus(null);
    setPasswordAgain(e.currentTarget.value);
  };

  const handler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event && event.preventDefault();
    setStatus(null);
    delay(resetPassword(username, code, password), 500)
      .then(() => {
        setStatus('success');
        setTimeout(() => {
          window.location.href = `/?lang=${estimateLanguage()}&username=${encodeURIComponent(
            username,
          )}&reset=true#/signin`;
        }, pageTransitionInterval);
      })
      .catch((error) => {
        setMessage(parseCognitoResetPasswordError(error));
        setStatus('warning');
      });
  };

  return (
    <div className="signup">
      <div className="container">
        <img src={Logo} alt="" className="logo" />
        <h1>{__('Change your password')}</h1>
        {!!qsusername && status !== 'warning' && (
          <Alert type="success">
            {__(
              'Please check your email and enter the verification code like <code>123456</code> with new password.',
            )}
          </Alert>
        )}
        {status === 'warning' && <Alert type="warning">{message}</Alert>}

        <form className="form">
          <label className="code">
            <h3>{__('Verification Code')}</h3>
            <input
              id={'code'}
              type={'text'}
              value={code}
              onChange={onCodeChange}
            />
          </label>
          <label className="username">
            <h3>{__('Username or email')}</h3>
            <input
              id={'username'}
              type={'text'}
              value={username}
              onChange={onUsernameChange}
              disabled={!!qsusername}
            />
          </label>
          <label className="password">
            <h3>{__('New password')}</h3>
            <input
              id={'password'}
              type={'password'}
              value={password}
              onChange={onPasswordChange}
              autoComplete={'new-password'}
            />
          </label>
          <label className="confirm-password">
            <h3>{__('Confirm new password')}</h3>
            <input
              id={'confirm-password'}
              type={'password'}
              value={passwordAgain}
              onChange={onPasswordAgainChange}
              autoComplete={'new-password'}
            />
          </label>
          <p className="message">
            {__(
              'Make sure at least 8 characters including a number and a lowercase letter.',
            )}
          </p>
          <p>
            <Button
              variant="contained"
              color="primary"
              onClick={handler}
              disabled={
                password === '' ||
                username === '' ||
                passwordAgain === '' ||
                password !== passwordAgain ||
                status === 'requesting' ||
                status === 'success' ||
                !code.match(/^[0-9]{6}$/g)
              }
              type={'submit'}
            >
              {__('Change password')}
            </Button>
          </p>
          <p>
            <Link
              href={`/?lang=${estimateLanguage()}#/forgot-password`}
              tabIndex={400}
            >
              {__('Request a new verification code')}
            </Link>
          </p>
          <StatusIndication status={status}></StatusIndication>
        </form>

        <div className="support-container">
          <Support />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: Geolonia.Redux.AppState) => ({
  currentUser: state.authSupport.currentUser || '',
});

export default connect(mapStateToProps)(Content);
