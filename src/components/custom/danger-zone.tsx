import React from "react";
import Typography from "@material-ui/core/Typography";
import { __ } from "@wordpress/i18n";

type Props = {
  whyDanger: string;
  children: React.ReactNode;
};

const styleDangerZone: React.CSSProperties = {
  border: "1px solid #ff0000",
  marginTop: "10em",
  padding: "16px 24px"
};

export const DangerZone = (props: Props) => {
  return (
    <div style={styleDangerZone}>
      <Typography component="h3" color="secondary">
        {__("Danger Zone")}
      </Typography>
      <p>{props.whyDanger}</p>
      {props.children}
    </div>
  );
};

export default DangerZone;
