import React from 'react';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';

import './Signin.scss';
import Logo from './custom/logo.svg';
import Support from './custom/Support';
import Alert from './custom/Alert';


type Props= {

}

const Content = (props: Props) => {
  const handleSignin = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

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
            <input type="text" />
          </label>
          <label className="password">
            <h2>Password</h2>
            <input type="text" />
          </label>
          <p className="forgot-password"><Link href="#/reset-password">Forgot password?</Link></p>
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

export default Content;
