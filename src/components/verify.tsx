import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';

import Support from './custom/Support';
import './Signup.scss';
import Logo from './custom/logo.svg';
import Alert from './custom/Alert';
import { verify } from '../auth';
import StatusIndication from './custom/status-indication';

import { __ } from '@wordpress/i18n';
import queryString from 'query-string';
import estimateLanguage from '../lib/estimate-language';
import { pageTransitionInterval } from '../constants';
import { parseVerifyError as parseCognitoVerifyError } from '../lib/cognito/parse-error';
import { Link } from '@material-ui/core';
import { sleep } from '../lib/sleep';
import { useInvitationToken } from '../hooks/invitation-token';

const Verify = () => {
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<
    null | 'requesting' | 'success' | 'warning'
  >(null);
  const [message, setMessage] = useState('');
  const { isReady, acceptInvitationCallback } = useInvitationToken(window.location.search);

  const parsed = queryString.parse(window.location.search);
  const hasQueryStringUsername =
    !!parsed.username && typeof parsed.username === 'string';

  useEffect(() => {
    if (hasQueryStringUsername && username === '') {
      setUsername(parsed.username as string);
      const codeInput = document.getElementById('code');
      codeInput && codeInput.focus();
    }
  }, [hasQueryStringUsername, parsed.username, username]);

  const buttonDisabled = !isReady || username === '' || !/^[0-9]{6}$/g.test(code);

  const onUsernameChange = (e: React.FormEvent<HTMLInputElement>) => {
    setStatus(null);
    setUsername(e.currentTarget.value);
  };
  const onCodeChange = (e: React.FormEvent<HTMLInputElement>) => {
    setStatus(null);
    const nextCode = e.currentTarget.value;
    if (nextCode.length < 7) {
      setCode(e.currentTarget.value);
    }
  };

  const handleVerify = async (e: React.MouseEvent<HTMLButtonElement> | void) => {
    e && e.preventDefault();
    setStatus('requesting');
    try {
      await verify(username, code);
    } catch (error: any) {
      setMessage(parseCognitoVerifyError(error));
      setStatus('warning');
    }
    setStatus('success');

    try {
      await acceptInvitationCallback();
    } catch (error) {
      // チームへの招待失敗のエラーは無視し、あくまでサインアップ-メールアドレス認証を完結してもらう
      // eslint-disable-next-line no-console
      console.error(error);
    }

    await sleep(pageTransitionInterval);

    const qs = new URLSearchParams({
      lang: estimateLanguage(),
      username: encodeURIComponent(username),
    }).toString();
    window.location.href = `/?${qs}#/signin`;
  };

  return (
    <div className="signup">
      <div className="container">
        <img src={Logo} alt="" className="logo" />
        <h1>{__('Welcome to Geolonia')}</h1>
        <h2>{__('Verify your account')}</h2>
        {status === 'warning' && <Alert type={status}>{message}</Alert>}
        {hasQueryStringUsername && !status && (
          <Alert type="success">
            {__(
              'Please check your email and enter the verification code like <code>123456</code>.',
            )}
          </Alert>
        )}
        <form className="form">
          <label className="username">
            <h3>{__('Username')}</h3>
            <input
              id={'username'}
              type={'text'}
              value={username}
              onChange={onUsernameChange}
              disabled={hasQueryStringUsername || !isReady}
            />
          </label>
          <label className="text">
            <h3>{__('Verification code')}</h3>
            <input
              id={'code'}
              type={'text'}
              value={code}
              onChange={onCodeChange}
              disabled={!isReady}
            />
          </label>

          <p>
            <Button
              variant="contained"
              color="primary"
              onClick={handleVerify}
              disabled={buttonDisabled}
              type={'submit'}
            >
              {__('Verify')}
            </Button>
          </p>
          <p>
            <Link href="#/resend">
              {__('Request a new verification code.')}
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

export default Verify;
