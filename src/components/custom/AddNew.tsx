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

const AddNew = (props: Props) => {
  const [open, setOpen] = React.useState(false);

  const buttonStyle: React.CSSProperties = {
    textAlign: "right",
    margin: 0,
  }

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <div>
      <form>
        <p style={buttonStyle}><Button variant="contained" color="primary" onClick={handleClickOpen}><AddIcon /> New</Button></p>
        <Dialog open={open} onClose={handleClose} fullWidth={true} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">{props.label}</DialogTitle>
          <DialogContent>
            <DialogContentText>{props.description}</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              name="api-name"
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
            <Button onSubmit={props.handler} color="primary" type="submit">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
}

AddNew.defaultProps = {
  handler: (event: React.MouseEvent) => {
    console.log(event)
  },
};

export default AddNew;
