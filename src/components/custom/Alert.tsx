import React from "react";

import "./Alert.scss";
import Interweave from "interweave";

type Props = {
  children: string;
  type?: "success" | "danger" | "warning" | "custom-outlined";
  Icon?: React.FC<any>,
};

const Alert = (props: Props) => {
  const { type = "success", children, Icon } = props;

  return (
    <div className="alert">
      <div className={type}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {Icon && <span style={{ marginRight: '.5em' }}><Icon /></span>}
          <Interweave content={children}></Interweave>
        </div>
      </div>
    </div>
  );
};

export default Alert;
