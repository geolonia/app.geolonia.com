import React from 'react';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

type Props= {
  label: string,
  handler: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const Save = (props: Props) => {
  const [open, setOpen] = React.useState(false);

  const style: React.CSSProperties = {
    marginTop: '1em',
    width: '100%',
  }

  const handleSave = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    props.handler(event)
    setOpen(true)
  }

  function handleClose(event: React.SyntheticEvent | React.MouseEvent, reason?: string) {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  }

  return (
    <div>
      <Typography style={style} component="p" paragraph={true} align="right">
        <Button variant="contained" color="primary" onClick={handleSave}>{props.label}</Button>
      </Typography>
      <Snackbar
        className="snackbar-saved"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">Saved.</span>}
        action={[
          <IconButton
            key="close"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />
    </div>
  );
}

Save.defaultProps = {
  label: 'Save',
  handler: (event: React.MouseEvent) => {
    console.log(event)
  }
};

export default Save;
