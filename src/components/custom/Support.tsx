import React from 'react';
import Link from '@material-ui/core/Link';

import {__} from '@wordpress/i18n'

import './Support.scss'

type Props= {

}

const Content = (props: Props) => {
  return (
    <div className="support-menu">
      <ul>
        <li><Link href="https://geolonia.com/terms">{__('Terms')}</Link></li>
        <li><Link href="https://geolonia.com/privacy">{__('Privacy')}</Link></li>
        <li><Link href="https://geolonia.com/contact">{__('Contact Geolonia')}</Link></li>
      </ul>
    </div>
  );
}

Content.defaultProps = {

};

export default Content;
