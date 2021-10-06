import React from 'react';
import Link from '@material-ui/core/Link';

import { __ } from '@wordpress/i18n';

import './Support.scss';

type Props = {};

const Support = (props: Props) => {
  return (
    <div className="support-menu">
      <ul>
        <li>
          <Link href="https://geolonia.com/terms" target="_blank">{__('Terms')}</Link>
        </li>
        <li>
          <Link href="https://geolonia.com/privacy" target="_blank">{__('Privacy')}</Link>
        </li>
        <li>
          <Link href="https://geolonia.com/contact" target="_blank">
            {__('Contact')}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Support;
