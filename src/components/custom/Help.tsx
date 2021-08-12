import React from 'react';

import Icon from '@material-ui/icons/Help';

import './Help.scss';

type Props = {
  children: React.ReactNode;
  icon: any;
};

const Help = (props: Props) => {
  return (
    <div className="help">
      <div className="outer">
        <div className="flex">
          <div className="help-icon">
            <props.icon className="icon" />
          </div>
          <div className="help-container">{props.children}</div>
        </div>
      </div>
    </div>
  );
};

Help.defaultProps = {
  icon: Icon,
};

export default Help;
