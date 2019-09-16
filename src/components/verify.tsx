import React from 'react';
import Button from '@material-ui/core/Button';

import Support from './custom/Support';
import './Signup.scss';
import Logo from './custom/logo.svg';
import Alert from './custom/Alert';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js'
import {connect} from 'react-redux'
import {AppState} from '../redux/store'

type OwnProps = {}
type RouterProps = {
  history: {
    push: (path: string) => void
  }
}
type StateProps = {
  cognitoUser?: AmazonCognitoIdentity.CognitoUser,
}

type Props = OwnProps & RouterProps & StateProps

const messages = {
  'success': 'Verification successed.',
  'warning': 'Verification failed.'
}

const Content = (props: Props) => {

  const {cognitoUser} = props

  const [username, setUsername] = React.useState('')
  const [code, setCode] = React.useState('')
  const [status, setStatus] = React.useState<null | 'success' | 'warning'>(null)

  React.useEffect(() => {
    if (cognitoUser && username === '') {
        setUsername(cognitoUser.getUsername())
    }
  }, [cognitoUser, username])

  const onUsernameChange = (e: React.FormEvent<HTMLInputElement>) => {
    setStatus(null)
    setUsername(e.currentTarget.value)
  }
  const onCodeChange = (e: React.FormEvent<HTMLInputElement>) => {
    setStatus(null)
    setCode(e.currentTarget.value)
  }

  const handleVerify = () => {
    setStatus(null)
    if (cognitoUser) {
        cognitoUser.confirmRegistration(code, true, (err, result) => {
          if (err) {
              setStatus('warning')
              console.error(err)
          } else {
            setStatus('success')
            console.log(result)
            props.history.push('/signin')
          }
        })
    } else {
      setStatus('warning')
    }
  }

  return (
    <div className="signup">
      <div className="container">
        <img src={Logo} alt="" className="logo" />
        <h1>Welcome to Geolonia</h1>
        <h2>Verify your account</h2>

        <div className="form">
          <label className="username">
            <h3>Username</h3>
            <input type="text" value={username} onChange={onUsernameChange} />
          </label>
          <label className="text">
            <h3>Verification code</h3>
            <input type="text" value={code} onChange={onCodeChange} />
          </label>

          <p><Button variant="contained" color="primary" onClick={handleVerify}>verify</Button></p>
        </div>

        <div className="support-container"><Support /></div>
      </div>
      { status && <Alert type={status}>{messages[status]}</Alert>}
    </div>
  );
}

Content.defaultProps = {

};

const mapStateToProps = (state: AppState): StateProps => ({
  cognitoUser: state.authSupport.cognitoUser
})
const ConnectedContent = connect(mapStateToProps)(Content)

export default ConnectedContent;
