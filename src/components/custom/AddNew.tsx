import React from "react";

// Components
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import AddIcon from "@material-ui/icons/Add";
import { CircularProgress } from "@material-ui/core";

// Utils
import { __ } from "@wordpress/i18n";

type Props = {
  // required
  label: string;
  description: string;
  defaultValue: string;
  onClick: (value: string) => Promise<any>;
  onError: (error: any) => void;
  // optionals
  buttonLabel?: string;
  fieldName?: string;
  fieldLabel?: string;
  fieldType?: string;
  errorMessage?: string;
};

const getTexts = (props: Props) => ({
  buttonLabel: props.buttonLabel || __("New"),
  fieldName: props.fieldName || __("name"),
  fieldLabel: props.fieldLabel || __("Name"),
  fieldType: props.fieldType || __("text"),
  errorMessage: props.errorMessage || __("Some error.")
});

export const AddNew = (props: Props) => {
  const { defaultValue, label, description } = props;
  const {
    buttonLabel,
    fieldName,
    fieldLabel,
    fieldType,
    errorMessage
  } = getTexts(props);

  const [text, setText] = React.useState(defaultValue);
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

  const isButtonsDisabled = status === "working" || status === "success";

  return (
    <div>
      <p style={buttonStyle}>
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          <AddIcon /> {buttonLabel}
        </Button>
      </p>
      <form>
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth={true}
          disableBackdropClick={isButtonsDisabled}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">{label}</DialogTitle>
          <DialogContent>
            <DialogContentText>{description}</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              name={fieldName}
              label={fieldLabel}
              type={fieldType}
              value={text}
              onChange={e => {
                setStatus(false);
                setText(e.target.value);
              }}
              fullWidth
            />
            {status === "failure" && (
              <DialogContentText>{errorMessage}</DialogContentText>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              color="primary"
              disabled={isButtonsDisabled}
            >
              {__("Cancel")}
            </Button>
            <Button
              onClick={onSaveClick}
              disabled={isButtonsDisabled}
              color="primary"
              type="submit"
            >
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

export default AddNew;
