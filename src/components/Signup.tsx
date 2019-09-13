import React from 'react';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';

import './Signup.scss';
import Logo from './custom/logo.svg';

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

        <div className="form">
          <label className="username">
            <h2>Username</h2>
            <input type="text" />
          </label>
          <label className="email">
            <h2>Email address</h2>
            <input type="text" />
          </label>
          <label className="password">
            <h2>Password</h2>
            <input type="text" />
          </label>
          <p><Button variant="contained" color="primary" onClick={handleSignup}>Sign up</Button></p>
          <p className="message">By signing up to Geolonia, you agree to our <Link href="https://geolonia.com/terms">Terms of service</Link> and <Link href="https://geolonia.com/privacy">Privacy policy</Link>.</p>
        </div>
      </div>
    </div>
  );
}

Content.defaultProps = {

};

export default Content;
