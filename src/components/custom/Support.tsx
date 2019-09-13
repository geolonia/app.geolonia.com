import React from 'react';
import Link from '@material-ui/core/Link';

import './Support.scss'

type Props= {

}

const Content = (props: Props) => {
  return (
    <div className="support-menu">
      <ul>
        <li><Link href="https://geolonia.com/terms">Terms</Link></li>
        <li><Link href="https://geolonia.com/privacy">Privacy</Link></li>
        <li><Link href="https://geolonia.com/contact">Contact Geolonia</Link></li>
      </ul>
    </div>
  );
}

Content.defaultProps = {

};

export default Content;
