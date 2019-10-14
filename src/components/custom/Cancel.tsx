import React from "react";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

// utils
import { __ } from "@wordpress/i18n";

type Props = {
  label: string;
  style: React.CSSProperties;
  handler: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
};

const Cancel = (props: Props) => {
  const style: React.CSSProperties = {
    marginTop: "1em",
    marginBottom: 0,
    width: "100%",
    ...props.style
  };

  return (
    <div>
      <Typography style={style} component="p" paragraph={true} align="right">
        <Button
          color="primary"
          onClick={props.handler}
          disabled={props.disabled}
        >
          {props.label}
        </Button>
      </Typography>
    </div>
  );
};

Cancel.defaultProps = {
  label: __("Cancel"),
  style: {},
  handler: (event: React.MouseEvent) => {
    console.log(event);
  }
};

export default Cancel;
