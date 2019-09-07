import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';

type Props = {
  label: string,
  description: string,
  default: string,
  handler: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
}

const FormDialog = (props: Props) => {
  const [open, setOpen] = React.useState(false);

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleClickOpen}><AddIcon /> New</Button>
      <Dialog open={open} onClose={handleClose} fullWidth={true} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{props.label}</DialogTitle>
        <DialogContent>
          <DialogContentText>{props.description}</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            value={props.default}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={props.handler} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

FormDialog.defaultProps = {
  handler: (event: React.MouseEvent) => {
    console.log(event)
  },
};

export default FormDialog;
