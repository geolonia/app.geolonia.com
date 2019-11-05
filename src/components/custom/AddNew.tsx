import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import AddIcon from "@material-ui/icons/Add";
import { CircularProgress } from "@material-ui/core";
import { __ } from "@wordpress/i18n";

type Props = {
  // required
  label: string;
  description: string;
  default: string;
  // optionals
  buttonLabel: string;
  fieldName: string;
  fieldLabel: string;
  fieldType: string;
  errorMessage: string;
  onClick: (value: string) => Promise<any>;
  onError: (error: any) => void;
};

export const AddNew = (props: Props) => {
  const [text, setText] = React.useState(props.default);
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState<
    false | "working" | "success" | "failure"
  >(false);

  const buttonStyle: React.CSSProperties = {
    textAlign: "right",
    margin: 0
  };

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setStatus(false);
    setOpen(false);
  }

  const onSaveClick = () => {
    setStatus("working");
    props
      .onClick(text)
      .then(() => {
        setStatus("success");
        handleClose();
      })
      .catch(err => {
        setStatus("failure");
        props.onError(err);
      });
  };

  return (
    <div>
      <p style={buttonStyle}>
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          <AddIcon /> {props.buttonLabel}
        </Button>
      </p>
      <form>
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth={true}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">{props.label}</DialogTitle>
          <DialogContent>
            <DialogContentText>{props.description}</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              name={props.fieldName}
              label={props.fieldLabel}
              type={props.fieldType}
              value={text}
              onChange={e => setText(e.target.value)}
              fullWidth
            />
            {status === "failure" && (
              <DialogContentText>{props.errorMessage}</DialogContentText>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              {__("Cancel")}
            </Button>
            <Button onClick={onSaveClick} color="primary" type="submit">
              {status === "working" && (
                <CircularProgress size={16} style={{ marginRight: 8 }} />
              )}
              {__("Save")}
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
};

const noop = (x: any) => x;

AddNew.defaultProps = {
  buttonLabel: __("New"),
  fieldName: __("name"),
  fieldLabel: __("Name"),
  fieldType: __("text"),
  errorMessage: __("Some error."),
  onClick: noop,
  onError: noop
};

export default AddNew;
