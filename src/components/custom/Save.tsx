import React from "react";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { CircularProgress } from "@material-ui/core";

// utils
import { __ } from "@wordpress/i18n";

type Props = {
  label: string;
  style: React.CSSProperties;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<any>;
  onError: (err: Error) => any;
  disabled?: boolean;
};

const Save = (props: Props) => {
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState<
    false | "working" | "success" | "failure"
  >(false);

  const style: React.CSSProperties = {
    marginTop: "1em",
    marginBottom: 0,
    width: "100%",
    ...props.style
  };

  const handleSave = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setStatus("working");
    props
      .onClick(event)
      .then(() => {
        setStatus("success");
        setOpen(true);
      })
      .catch(err => {
        setStatus("failure");
        setOpen(true);
        props.onError(err);
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
      <Typography style={style} component="p" paragraph={true} align="right">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={props.disabled || status !== false}
        >
          {status === "working" && (
            <CircularProgress size={16} style={{ marginRight: 8 }} />
          )}
          {props.label}
        </Button>
      </Typography>
      <Snackbar
        className="snackbar-saved"
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

Save.defaultProps = {
  label: __("Save"),
  style: {},
  onClick: (event: React.MouseEvent) => {
    console.log(event);
  },
  onError: (err: Error) => {
    console.error(err);
  }
};

export default Save;
