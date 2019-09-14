import React from 'react';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';

import Support from './custom/Support';
import './Signup.scss';
import Logo from './custom/logo.svg';
import Alert from './custom/Alert';

type Props= {

}

const Content = (props: Props) => {
  const handleSignup = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

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
            <input type="text" />
          </label>
          <label className="email">
            <h3>Email address</h3>
            <input type="text" />
          </label>
          <label className="password">
            <h3>Password</h3>
            <input type="text" />
          </label>
          <p className="message">Make sure it's at least 15 characters OR at least 8 characters including a number and a lowercase letter.</p>

          <p><Button variant="contained" color="primary" onClick={handleSignup}>Sign up</Button></p>
          <p className="message">By signing up to Geolonia, you agree to our <Link href="https://geolonia.com/terms">Terms of service</Link> and <Link href="https://geolonia.com/privacy">Privacy policy</Link>.</p>
        </div>

        <div className="support-container"><Support /></div>
      </div>
    </div>
  );
}

Content.defaultProps = {

};

export default Content;
