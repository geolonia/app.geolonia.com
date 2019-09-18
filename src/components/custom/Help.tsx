import React from 'react';

import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

import Icon from '@material-ui/icons/NotificationsActive'
import MenuBookIcon from '@material-ui/icons/MenuBook'
import IconButton from '@material-ui/core/IconButton';

import './Help.scss'

type Props = {
  children: any,
  icon: any,
}

const Help = (props: Props) => {
  return (
    <div className="help"><div className="outer">
      <div className="flex">
        <div className="help-icon"><props.icon className="icon" /></div>
        <div className="help-container">
          {props.children}
        </div>
      </div>
    </div></div>
  );
}

Help.defaultProps = {
  icon: Icon,
};

export default Help;
