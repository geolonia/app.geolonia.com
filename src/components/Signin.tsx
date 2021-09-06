import './Signin.scss';

import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Logo from './custom/logo.svg';
import Support from './custom/Support';
import Alert from './custom/Alert';
import StatusIndication from './custom/status-indication';

// Utils
import queryString from 'query-string';
import { __ } from '@wordpress/i18n';
import { parseSigninError as parseCognitoSigninError } from '../lib/cognito/parse-error';
import { sleep } from '../lib/sleep';

// API
import { signin } from '../auth';

// Hooks
import { useInvitationToken } from '../hooks/invitation-token';

// Redux
import Redux from 'redux';
import { createActions } from '../redux/actions/auth-support';
import { connect } from 'react-redux';

// constants
import { pageTransitionInterval } from '../constants';

// types
type OwnProps = Record<string, never>;
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

const focusOn = (id: string) => {
  const elm = document.getElementById(id);
  elm && elm.focus();
};

const Signin = (props: Props) => {
  const { serverTrouble } = props;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<
    null | 'requesting' | 'success' | 'warning'
  >(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordResetFlag, setPasswordResetFlag] = useState(false);
  const [postVerifyFlag, setPostVerifyFlag] = useState(false);
  const { fetchedEmail, isReady, acceptInvitationCallback } = useInvitationToken(window.location.search);

  useEffect(() => {
    const parsed = queryString.parse(window.location.search);
    if(typeof parsed.username === 'string') {
      setUsername(parsed.username);
      setPostVerifyFlag(true);
      focusOn('password');
    } else if(fetchedEmail) {
      setUsername(fetchedEmail);
      focusOn('password');
    }
    if(parsed.reset === 'true') {
      setPasswordResetFlag(true);
    }
  }, [fetchedEmail]);

  const onUsernameChange = (e: React.FormEvent<HTMLInputElement>) => {
    setStatus(null);
    setUsername(e.currentTarget.value);
  };

  const onPasswordChange = (e: React.FormEvent<HTMLInputElement>) => {
    setStatus(null);
    setPassword(e.currentTarget.value);
  };

  const buttonDisabled =
    !isReady ||
    username === '' ||
    password === '' ||
    status === 'success' ||
    status === 'requesting';

  const handleSignin = async (e: React.MouseEvent | void) => {
    e && e.preventDefault();
    setStatus('requesting');

    try {
      await signin(username, password);
    } catch (error: any) {
      setErrorMessage(parseCognitoSigninError(error));
      setStatus('warning');
    }

    try {
      await acceptInvitationCallback();
    } catch (error) {
      // チームへの招待失敗のエラーは無視し、あくまでサインインを完結してもらう
      // eslint-disable-next-line no-console
      console.error(error);
    }

    setStatus('success');
    await sleep(pageTransitionInterval);
    // Force reload and use componentDidMount of AuthContainer to get session
    window.location.href = '/';
  };

  const onPasswordKeyDown = (e: React.KeyboardEvent) => {
    // enter
    e.keyCode === 13 && !buttonDisabled && handleSignin();
  };

  let alert: React.ReactNode | null = null;
  if(status === 'warning') {
    <Alert type="warning">{errorMessage}</Alert>;
  } else if (passwordResetFlag) {
    alert = <Alert type="success">{__('Your password has been successfully reset. Please reenter and sign in to the account.')}</Alert>;
  } else if (postVerifyFlag) {
    alert = <Alert type="success">{__('Your account has been successfully verified. Please enter your password again and sign in to your account.')}</Alert>;
  }

  return (
    <div className="signin">
      <div className="container">
        <img src={Logo} alt="" className="logo" />
        <h1>{__('Sign in to Geolonia')}</h1>
        {alert}
        {serverTrouble && (
          <Alert type={'warning'}>
            {__('Oops, the server seems not to be responding correctly.')}
          </Alert>
        )}
        <form className="form">
          <label className="username">
            <h2>{__('Username or email address')}</h2>
            <input
              id={'username'}
              type={'text'}
              value={username}
              onChange={onUsernameChange}
              disabled={!!fetchedEmail || !isReady}
              tabIndex={100}
              autoComplete={'username'}
            />
          </label>
          <label className="password">
            <h2>{__('Password')}</h2>
            <input
              id={'password'}
              type={'password'}
              value={password}
              onChange={onPasswordChange}
              onKeyDown={onPasswordKeyDown}
              disabled={!isReady}
              tabIndex={200}
              autoComplete={'current-password'}
            />
          </label>
          <p className="forgot-password">
            <Link href="#/forgot-password" tabIndex={400}>
              {__('Forgot password?')}
            </Link>
          </p>
          <p>
            <Button
              id={'signin'}
              variant="contained"
              color="primary"
              onClick={handleSignin}
              tabIndex={300}
              disabled={buttonDisabled}
              type={'submit'}
            >
              {__('Sign in')}
            </Button>
          </p>
          <StatusIndication status={status}></StatusIndication>
        </form>

        <p>
          {__('New to Geolonia?')}{' '}
          <Link href="#/signup" tabIndex={500}>
            {__('Create an account.')}
          </Link>
        </p>

        <div className="support-container">
          <Support />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: Geolonia.Redux.AppState): StateProps => ({
  serverTrouble: state.authSupport.hasTrouble,
});
const mapDispatchToProps = (dispatch: Redux.Dispatch) => ({
  setAccessToken: (accessToken: string) =>
    dispatch(createActions.setAccessToken(accessToken)),
});
const ConnectedContent = connect(mapStateToProps, mapDispatchToProps)(Signin);

export default ConnectedContent;
