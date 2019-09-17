import React from 'react';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';

import './Signin.scss';
import Logo from './custom/logo.svg';
import Support from './custom/Support';
import Alert from './custom/Alert';
import {connect} from 'react-redux'
import {AppState} from '../redux/store'
import {signin} from '../auth'

type OwnProps = {}
type RouterProps = {
  history: {
    push: (path: string) => void
  }
}
type StateProps = {
  signupUser?: string,
}
type Props = OwnProps & RouterProps & StateProps

const messages = {
  'success': 'Signin successed.',
  'warning': 'Signin failed.'
}

const Content = (props: Props) => {

  const {signupUser} = props

  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [status, setStatus] = React.useState<null | 'success' | 'warning'>(null)

  React.useEffect(() => {
    if (signupUser && username === '') {
        setUsername(signupUser)
    }
  }, [signupUser, username])

  const onUsernameChange = (e: React.FormEvent<HTMLInputElement>) => {
    setStatus(null)
    setUsername(e.currentTarget.value)
  }
  const onPasswordChange = (e: React.FormEvent<HTMLInputElement>) => {
    setStatus(null)
    setPassword(e.currentTarget.value)
  }

  const handleSignin = () => {
    setStatus(null)
    signin(username, password)
      .then(() => {
        setStatus('success')
        setTimeout(() => props.history.push('/'), 2000)
      })
      .catch((err) => {
        setStatus('warning')
        console.error(err)
      })
  }

  return (
    <div className="signin">
      <div className="container">
        <img src={Logo} alt="" className="logo" />
        <h1>Sign in to Geolonia</h1>
        <Alert type="success">Your password has beed successfully updated.</Alert>
        <div className="form">
          <label className="username">
            <h2>Username or email address</h2>
            <input type="text" value={username} onChange={onUsernameChange} />
          </label>
          <label className="password">
            <h2>Password</h2>
            <input type="text" value={password} onChange={onPasswordChange}/>
          </label>
          <p className="forgot-password"><Link href="#/forgot-password">Forgot password?</Link></p>
          <p><Button variant="contained" color="primary" onClick={handleSignin}>Sign in</Button></p>
        </div>

        <p>New to Geolonia? <Link href="#/signup">Create an account.</Link></p>

        <div className="support-container"><Support /></div>
      </div>
    </div>
  );
}

Content.defaultProps = {

};

const mapStateToProps = (state: AppState): StateProps => ({
  signupUser: state.authSupport.currentUser
})
const ConnectedContent = connect(mapStateToProps)(Content)

export default ConnectedContent;
