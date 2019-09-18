import React from 'react';
import Button from '@material-ui/core/Button';

import Support from './custom/Support';
import './ForgotPassword.scss';
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
        <h1>Reset your password</h1>

        <div className="form">
          <label className="email">
            <h3>Email address</h3>
            <input type="text" />
          </label>
          <p className="message">We will send you a link to reset your password.</p>
          <p><Button variant="contained" color="primary" onClick={handleSignup}>Send password reset email</Button></p>
        </div>

        <div className="support-container"><Support /></div>
      </div>
    </div>
  );
}

Content.defaultProps = {

};

export default Content;
