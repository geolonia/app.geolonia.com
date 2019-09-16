import React from 'react';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';

import Support from './custom/Support';
import './Signup.scss';
import Logo from './custom/logo.svg';
import Alert from './custom/Alert';
import { signUp } from '../auth'
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js'
import Redux from 'redux'
import {connect} from 'react-redux'
import {createActions} from '../redux/actions/auth-support'
import {AppState} from '../redux/store'

type OwnProps = {}
type StateProps = {
  cognitoUser?: AmazonCognitoIdentity.CognitoUser,
}
type DispatchProps = {
  setSignupResult: (user: AmazonCognitoIdentity.CognitoUser) => void
}

type Props = OwnProps & StateProps & DispatchProps

const Content = (props: Props) => {
  const [username, setUsername] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState<null | Error>(null)

  const onUsernameChange = (e: React.FormEvent<HTMLInputElement>) => {
    setError(null)
    setUsername(e.currentTarget.value)
  }
  const onEmailChange = (e: React.FormEvent<HTMLInputElement>) => {
    setError(null)
    setEmail(e.currentTarget.value)
  }
  const onPasswordChange = (e: React.FormEvent<HTMLInputElement>) => {
    setError(null)
    setPassword(e.currentTarget.value)
  }

  const handleSignup = () => {
    setError(null)
    signUp(username, email, password)
      .then(result => {
        props.setSignupResult(result.user)
      })
      .catch(setError)
  }
  return (
    <div className="signup">
      <div className="container">
        <img src={Logo} alt="" className="logo" />
        <h1>Welcome to Geolonia</h1>
        <h2>Create your account</h2>

        <div className="form">
          <label className="username">
            <h3>Username</h3>
            <input type="text" value={username} onChange={onUsernameChange} />
          </label>
          <label className="email">
            <h3>Email address</h3>
            <input type="text" value={email} onChange={onEmailChange} />
          </label>
          <label className="password">
            <h3>Password</h3>
            <input type="text" value={password} onChange={onPasswordChange} />
          </label>
          <p className="message">Make sure it's at least 15 characters OR at least 8 characters including a number and a lowercase letter.</p>

          <p><Button variant="contained" color="primary" onClick={handleSignup}>Sign up</Button></p>
          <p className="message">By signing up to Geolonia, you agree to our <Link href="https://geolonia.com/terms">Terms of service</Link> and <Link href="https://geolonia.com/privacy">Privacy policy</Link>.</p>
        </div>

        <div className="support-container"><Support /></div>
      </div>
      {error&&<Alert type={'warning'}>{'Failed'}</Alert>}
    </div>
  );
}

Content.defaultProps = {

};

const mapStateToProps = (state:AppState): StateProps => ({
  cognitoUser: state.authSupport.cognitoUser
})
const mapDispatchToProps = (dispatch: Redux.Dispatch): DispatchProps => ({
  setSignupResult: (user: AmazonCognitoIdentity.CognitoUser) => dispatch(createActions.setCognitoUser(user))
})
const ConnectedContent = connect<StateProps, DispatchProps>(mapStateToProps, mapDispatchToProps)(Content)

export default ConnectedContent;
