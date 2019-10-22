import React from "react";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import { CircularProgress } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";

import { __ } from "@wordpress/i18n";

type Props = {
  text1: string;
  text2: string;
  onClick: () => Promise<any>;
  onFailure: () => void;
  enable: (inputValue: string) => boolean;
};

const Delete = (props: Props) => {
  const [open, setOpen] = React.useState(false);
  const [confirmation, setConfirmation] = React.useState("");
  const [status, setStatus] = React.useState<
    false | "working" | "success" | "failure"
  >(false);

  const style = {
    marginTop: "1em",
    width: "100%"
  } as React.CSSProperties;

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setConfirmation("");
    setOpen(false);
  }

  const onButtonClick = () => {
    if (props.enable(confirmation)) {
      setStatus("working");
      props
        .onClick()
        .then(() => {
          setStatus("success");
        })
        .catch(() => {
          setStatus("failure");
          props.onFailure();
        })
        .finally(() => {
          setConfirmation("");
          setTimeout(() => setStatus(false), 1000);
        });
    }
  };

  return (
    <div>
      <form>
        <Typography style={style} component="p" paragraph={true} align="left">
          <Button
            variant="contained"
            color="secondary"
            onClick={handleClickOpen}
          >
            {__("Delete")}
          </Button>
        </Typography>
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth={true}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">{__("Delete")}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {props.text1}
              <br />
              {props.text2}
            </DialogContentText>
            <TextField
              autoFocus
              error
              margin="dense"
              name="name"
              label={__("Name")}
              type="text"
              value={confirmation}
              onChange={e => setConfirmation(e.target.value)}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="inherit">
              {__("Cancel")}
            </Button>
            <Button
              color="secondary"
              onClick={onButtonClick}
              type="submit"
              disabled={!props.enable(confirmation)}
            >
              {status === "working" ? (
                <CircularProgress
                  size={16}
                  style={{ marginRight: 8 }}
                  color={"secondary"}
                />
              ) : status === "success" ? (
                <CheckIcon fontSize={"default"} color={"secondary"} />
              ) : null}
              {__("Delete")}
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
};

Delete.defaultProps = {
  text1: __("Are you sure you want to delete this item?"),
  text2: __("Please type as <code>delete</code> to confirm."),
  onClick: (event: React.MouseEvent) => {
    console.log(event);
  },
  onFailure: () => {},
  enable: (text: string) => {
    return text === "delete";
  }
} as Partial<Props>;

export default Delete;
