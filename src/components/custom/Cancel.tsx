import React from "react";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

// utils
import { __ } from "@wordpress/i18n";

type Props = {
  label?: string;
  style?: React.CSSProperties;
  handler?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
};

const getDefaultProps = (props: Props) => ({
  ...props,
  label: props.label || __("Cancel"),
  style: props.style || {},
  disabled: !!props.disabled
});

const Cancel = (props: Props) => {
  const { label, style, handler, disabled } = getDefaultProps(props);

  const typographyStyle: React.CSSProperties = {
    marginTop: "1em",
    marginBottom: 0,
    width: "100%",
    ...style
  };

  return (
    <div>
      <Typography
        style={typographyStyle}
        component="p"
        paragraph={true}
        align="right"
      >
        <Button color="primary" onClick={handler} disabled={disabled}>
          {label}
        </Button>
      </Typography>
    </div>
  );
};

export default Cancel;
