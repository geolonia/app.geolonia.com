import React from "react";

import "./Alert.scss";

type Props = {
  children: string;
  type?: "success" | "danger" | "warning";
};

const Alert = (props: Props) => {
  const { type = "success", children } = props;

  return (
    <div className="alert">
      <div className={type}>{children}</div>
    </div>
  );
};

export default Alert;
