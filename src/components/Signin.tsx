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

// API
import { signin } from '../auth';
import { acceptInvitation } from '../api/teams/accept-invitation';

// Redux
import Redux from 'redux';
import { createActions } from '../redux/actions/auth-support';
import { connect } from 'react-redux';

// constants
import { pageTransitionInterval } from '../constants';
import { sleep } from '../lib/sleep';

// types
import { CognitoUser } from 'amazon-cognito-identity-js';
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

const getUserEmail = (cognitoUser: CognitoUser | undefined): Promise<string | null> => {
  if(!cognitoUser) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    cognitoUser.getUserAttributes((error, attributes) => {
      if(error || !attributes) {
        resolve(null);
      } else {
        const emailAttribute = attributes.find((attr) => attr.Name === 'email');
        if(!emailAttribute) {
          resolve(null);
        } else {
          resolve(emailAttribute.Value);
        }
      }
    });
  });
};

const Signin = (props: Props) => {
  const { serverTrouble } = props;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<
    null | 'requesting' | 'success' | 'warning'
  >(null);
  const [message, setMessage] = useState('');
  const [invitationToken, setInvitationToken] = useState<string | null>(null);
  const [passwordResetFlag, setPasswordResetFlag] = useState(false);
  const [usernameGivenFlag, setUsernameGivenFlag] = useState(false);


  useEffect(() => {
    const parsed = queryString.parse(window.location.search);
    if(typeof parsed.invitationToken === 'string') {
      setInvitationToken(parsed.invitationToken);
    }
    if(typeof parsed.username === 'string') {
      setUsername(parsed.username);
      setUsernameGivenFlag(true);
      const passwordInput = document.getElementById('password');
      passwordInput && passwordInput.focus();
    }
    if(parsed.reset === 'true') {
      setPasswordResetFlag(true);
    }
  }, []);

  const onUsernameChange = (e: React.FormEvent<HTMLInputElement>) => {
    setStatus(null);
    setUsername(e.currentTarget.value);
  };

  const onPasswordChange = (e: React.FormEvent<HTMLInputElement>) => {
    setStatus(null);
    setPassword(e.currentTarget.value);
  };

  const buttonDisabled =
    username === '' ||
    password === '' ||
    status === 'success' ||
    status === 'requesting';

  const handleSignin = async (e: React.MouseEvent | void) => {
    e && e.preventDefault();
    setStatus('requesting');

    let cognitoUser;
    try {
      const signinResult = await signin(username, password);
      cognitoUser = signinResult.cognitoUser;
    } catch (error: any) {
      setMessage(parseCognitoSigninError(error));
      setStatus('warning');
    }

    if(invitationToken) {
      const userEmail = await getUserEmail(cognitoUser);
      if(userEmail) {
        await acceptInvitation(invitationToken,  userEmail);
      }
    }

    setStatus('success');
    await sleep(pageTransitionInterval);
    // Force reloadading and use componentDidMount of AuthContainer to get session
    window.location.href = '/';
  };

  const onPasswordKeyDown = (e: React.KeyboardEvent) => {
    // enter
    e.keyCode === 13 && !buttonDisabled && handleSignin();
  };

  return (
    <div className="signin">
      <div className="container">
        <img src={Logo} alt="" className="logo" />
        <h1>{__('Sign in to Geolonia')}</h1>
        {usernameGivenFlag && status === null && !serverTrouble && (
          <Alert type="success">
            {passwordResetFlag
              ? __(
                'Your password has been successfully reset. Please reenter and sign in to the account.',
              )
              : __(
                'Your account has been successfully verified. Please enter your password again and sign in to your account.',
              )}
          </Alert>
        )}
        {status === 'warning' ? <Alert type="warning">{message}</Alert> : null}
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
