import React from 'react';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

type Props= {
  text1: string,
  text2: string,
  handler: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const Delete = (props: Props) => {
  const [open, setOpen] = React.useState(false);

  const style = {
    marginTop: '1em',
    width: '100%',
  } as React.CSSProperties

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <div>
      <Typography style={style} component="p" paragraph={true} align="left"><Button variant="contained" color="secondary" onClick={handleClickOpen}>Delete</Button></Typography>
      <Dialog open={open} onClose={handleClose} fullWidth={true} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>{props.text1}<br />{props.text2}</DialogContentText>
          <TextField
            autoFocus
            error
            margin="dense"
            name="name"
            label="Name"
            type="text"
            value=""
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onSubmit={props.handler} color="secondary" type="submit">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

Delete.defaultProps = {
  text1: 'Are you sure you want to delete API key?',
  text2: 'Please type in the name of the API key to confirm.',
  handler: (event: React.MouseEvent) => {
    console.log(event)
  }
};

export default Delete;
