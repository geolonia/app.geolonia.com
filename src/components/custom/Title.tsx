import React from 'react';

import Icon from '@material-ui/icons/Help'

import './Title.scss'

type Props = {
  title: string,
  children: any,
  icon: any,
}

const Help = (props: Props) => {
  return (
    <div className="title"><div className="outer">
      <h1>{props.title}</h1>
      <div className="title-container">
        {props.children}
      </div>
    </div></div>
  );
}

Help.defaultProps = {
  icon: Icon,
};

export default Help;
