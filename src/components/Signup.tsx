import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';

import Support from './custom/Support';
import Languages from './custom/languages';
import './Signup.scss';
import Logo from './custom/logo.svg';
import Alert from './custom/Alert';
import { signUp } from '../auth';
import Redux from 'redux';
import { connect } from 'react-redux';
import { createActions } from '../redux/actions/auth-support';
import StatusIndication from './custom/status-indication';
import { sprintf, __ } from '@wordpress/i18n';
import Interweave from 'interweave';
import { parseSignupError as parseCognitoSignupError } from '../lib/cognito/parse-error';
import estimateLanguage from '../lib/estimate-language';
import { pageTransitionInterval } from '../constants';
import queryString from 'query-string';
import { sleep } from '../lib/sleep';

import { acceptInvitation } from '../api/teams/accept-invitation';

// types
import { ISignUpResult } from 'amazon-cognito-identity-js';

type OwnProps = Record<string, never>;
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

type Status = null | 'requesting' | 'success' | 'warning';

const Signup = (props: Props) => {
  const [username, setUsername] = useState('');
  const [invitedEmail, setInvitedEmail] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<Status>(null);
  const [message, setMessage] = useState('');
  const [invitationToken, setInvitationToken] = useState<string | null>(null);

  const onUsernameChange = (e: React.FormEvent<HTMLInputElement>) => {
    setStatus(null);
    setUsername(e.currentTarget.value);
  };
  const onEmailChange = (e: React.FormEvent<HTMLInputElement>) => {
    setStatus(null);
    setEmail(e.currentTarget.value);
  };
  const onEmailBlur = (e: React.FormEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value.trim());
  };
  const onPasswordChange = (e: React.FormEvent<HTMLInputElement>) => {
    setStatus(null);
    setPassword(e.currentTarget.value);
  };

  const handleSignup = async (e: React.MouseEvent | void) => {
    e && e.preventDefault();
    setStatus('requesting');
    setUsername(username);

    let result: ISignUpResult;
    try {
      result = await signUp(username, email, password);
    } catch (err: any) {
      setMessage(parseCognitoSignupError(err || { code: '' }));
      setStatus('warning');
      return;
    }
    setStatus('success');

    const succeededUsername = result.user.getUsername();
    props.setCurrentUser(succeededUsername);
    if(invitationToken) {
      await acceptInvitation(invitationToken, email);
    }
    const query: { [key: string]: string } = {
      lang: estimateLanguage(),
      username: encodeURIComponent(succeededUsername),
    };
    const qs = new URLSearchParams(query).toString();

    await sleep(pageTransitionInterval);
    window.location.href = `/?${qs}#/verify`;
  };

  const usernameIsValid = username !== '';
  const emailIsValid = email !== '';
  const passwordIsValid = password !== '';
  const buttonDisabled = !usernameIsValid || !emailIsValid || !passwordIsValid;

  const onPasswordKeyDown = (e: React.KeyboardEvent) => {
    // enter
    e.keyCode === 13 && !buttonDisabled && handleSignup();
  };

  // URL locale will be sent to UserPool. So serialize persisted locale at first
  useEffect(() => {
    const parsed = queryString.parse(window.location.search);
    parsed.lang = estimateLanguage();
    const newUrl = `/?${queryString.stringify(parsed)}#/signup`;
    window.history.pushState({ path: newUrl }, '', newUrl);

    if(typeof parsed.invitationToken === 'string') {
      setInvitationToken(parsed.invitationToken);
    }
    if(typeof parsed.invitedEmail === 'string') {
      setEmail(parsed.invitedEmail);
      setInvitedEmail(parsed.invitedEmail);
    }
  }, []);

  return (
    <div className="signup">
      {status === 'warning' && <Alert type={status}>{message}</Alert>}
      <div className="container">
        <img src={Logo} alt="" className="logo" />
        <h1>{__('Welcome to Geolonia')}</h1>
        <h2>{__('Create your account')}</h2>
        <form className="form">
          <label className="username">
            <h3>{__('Username')}</h3>
            <input
              id={'username'}
              type={'text'}
              value={username}
              onChange={onUsernameChange}
            />
            <p className="message">
              {__('Username cannot be modified later.')}
            </p>
          </label>
          <label className="email">
            <h3>{__('Email address')}</h3>
            <input
              id={'email'}
              type={'text'}
              value={email}
              disabled={!!invitedEmail}
              onChange={onEmailChange}
              onBlur={onEmailBlur}
            />
          </label>
          <label className="password">
            <h3>{__('Password')}</h3>
            <input
              id={'password'}
              type={'password'}
              value={password}
              onChange={onPasswordChange}
              onKeyDown={onPasswordKeyDown}
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
              onClick={handleSignup}
              disabled={buttonDisabled}
              type={'submit'}
            >
              {__('Sign up')}
            </Button>
          </p>
          <StatusIndication status={status}></StatusIndication>

          <p className="message">
            <Interweave
              content={__(
                'By signing up to Geolonia, you agree to our <a href="https://geolonia.com/terms" target="_blank" class="MuiTypography-colorPrimary">Terms of service</a> and <a class="MuiTypography-colorPrimary" href="https://geolonia.com/privacy" target="_blank">Privacy policy</a>.',
              )}
            />
          </p>
        </form>

        <p className="message">
          <Interweave
            content={invitedEmail ?
              sprintf(__('Are you sure you\'re not %s? If, please <a href="/#/signin">sign in</a>.'), invitedEmail) :
              __('Already have an account? If so, please <a href="/#/signin">sign in</a>.')
            }
          />
        </p>

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
  setCurrentUser: (user: string) => dispatch(createActions.setCurrentUser(user)),
});

export default connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps,
)(Signup);
