import React from "react";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { CircularProgress } from "@material-ui/core";

// utils
import { __ } from "@wordpress/i18n";
import { messageDisplayDuration } from "../../constants";

type Props = {
  label?: string;
  style?: React.CSSProperties;
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => Promise<any>;
  onError?: (err: Error) => any;
  disabled?: boolean;
  buttonStyle?: React.CSSProperties;
};

const getDefaultProps = (props: Props) => ({
  label: props.label || __("Save"),
  style: props.style || {},
  onClick: props.onClick,
  onError: props.onError,
  disabled: !!props.disabled,
});

const Save = (props: Props) => {
  const { label, style, onClick, onError, disabled } = getDefaultProps(props);

  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState<
    false | "working" | "success" | "failure"
  >(false);

  const typographyStyle: React.CSSProperties = {
    marginTop: "1em",
    marginBottom: 0,
    width: "100%",
    ...style
  };

  const handleSave = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setStatus("working");
    if (typeof onClick === 'undefined') {
      return
    }

    onClick(event)
      .then(() => {
        setStatus("success");
        setOpen(true);
        setTimeout(() => setOpen(false), messageDisplayDuration);
      })
      .catch(err => {
        setStatus("failure");
        setOpen(true);
        if (typeof onError !== 'undefined') {
          onError(err);
        }
        setTimeout(() => setOpen(false), messageDisplayDuration);
      });
  };

  function handleClose(
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ) {
    if (reason === "clickaway") {
      return;
    }

    setStatus(false);
    setOpen(false);
  }

  return (
    <div>
      <Typography
        style={typographyStyle}
        component="p"
        paragraph={true}
        align="right"
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={disabled}
          style={props.buttonStyle}
        >
          {status === "working" && (
            <CircularProgress
              size={16}
              color={"inherit"}
              style={{ marginRight: 8 }}
            />
          )}
          {label}
        </Button>
      </Typography>
      <Snackbar
        className={`snackbar-saved ${status}`}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        ContentProps={{
          "aria-describedby": "message-id"
        }}
        message={
          <span id="message-id">
            {status === "success" ? __("Saved.") : __("Failed to save.")}
          </span>
        }
        action={[
          <IconButton
            key="close"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        ]}
      />
    </div>
  );
};

export default Save;
