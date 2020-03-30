import React from "react";
import { CircularProgress } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";

type Props = {
  status: "requesting" | "success" | "warning" | null;
};

export const StatusIndication = (props: Props) => {
  const { status } = props;
  return status === "requesting" ? (
    <div style={{ marginTop: ".75em" }}>
      <CircularProgress size={20} />
    </div>
  ) : status === "success" ? (
    <div style={{ marginTop: ".75em" }}>
      <CheckIcon fontSize={"default"} color={"primary"} />
    </div>
  ) : null;
};

export default StatusIndication;
