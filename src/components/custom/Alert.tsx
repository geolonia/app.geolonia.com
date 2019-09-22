import React from "react";

import "./Alert.scss";

type Props = {
  children: string;
  type: "success" | "danger" | "warning";
};

const Alert = (props: Props) => {
  return (
    <div className="alert">
      <div className={props.type}>{props.children}</div>
    </div>
  );
};

Alert.defaultProps = {
  type: "success"
};

export default Alert;
