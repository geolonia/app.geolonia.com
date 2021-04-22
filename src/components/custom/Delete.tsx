import React from "react";

// Components
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

// Utils
import { __ } from "@wordpress/i18n";

type Status = false | "working" | "success" | "failure";

type Props = {
  text1?: string;
  text2?: string;
  answer?: string;
  errorMessage: string;
  onClick: () => Promise<any>;
  onFailure?: () => void;
  disableCancel?: boolean | ((status?: Status) => boolean);
  disableDelete?: boolean | ((inputValue: string, status?: Status) => boolean);
};

const getTexts = (props: Props) => ({
  text1: props.text1 || __("Are you sure you want to delete this item?"),
  text2: props.text2 || __("Please type as <code>delete</code> to confirm."),
  answer: props.answer || "delete"
});

export const Delete: React.FC<Props> = (props) => {
  const { disableCancel, disableDelete } = props;
  const { text1, text2 } = getTexts(props);

  const [open, setOpen] = React.useState(false);
  const [confirmation, setConfirmation] = React.useState("");
  const [status, setStatus] = React.useState<Status>(false);

  const isCancelDisabled =
    typeof disableCancel === "function"
      ? disableCancel(status)
      : !!disableCancel;

  const isDeleteDisabled =
    typeof disableDelete === "function"
      ? disableDelete(confirmation, status)
      : !!disableDelete;

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

  const onCancelClick = () => {
    if (!isCancelDisabled) {
      handleClose();
    }
  };

  const onButtonClick = () => {
    if (!isDeleteDisabled) {
      setStatus("working");
      props
        .onClick()
        .then(() => {
          setStatus("success");
        })
        .catch(() => {
          setStatus("failure");
          if (props.onFailure) props.onFailure();
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
          disableBackdropClick={isCancelDisabled || status === "working"}
          fullWidth={true}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">{__("Delete")}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {text1}
              <br />
              {text2}
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
            {status === "failure" && (
              <DialogContentText>{props.errorMessage}</DialogContentText>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              color="inherit"
              onClick={onCancelClick}
              disabled={isCancelDisabled || status === "working"}
            >
              {__("Cancel")}
            </Button>
            <Button
              color="secondary"
              onClick={onButtonClick}
              type="submit"
              disabled={
                confirmation !== "delete" ||
                isDeleteDisabled ||
                status === "working"
              }
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

export default Delete;
