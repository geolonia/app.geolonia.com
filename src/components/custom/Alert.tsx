import React from "react";

import "./Alert.scss";
import Interweave from "interweave";

type Props = {
  children: string;
  type?: "success" | "danger" | "warning";
};

const Alert = (props: Props) => {
  const { type = "success", children } = props;

  return (
    <div className="alert">
      <div className={type}>
        <Interweave content={children}></Interweave>
      </div>
    </div>
  );
};

export default Alert;
