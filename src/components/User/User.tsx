import React from 'react';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';

import ProfileImage from '../custom/logo.svg';
import Save from '../custom/Save'

const Content = () => {
  const ProfileImageStyle = {
    maxWidth: '250px',
    height: 'auto',
    fill: '#f5f5f5',
  } as React.CSSProperties

  const linkStyle = {
    marginLeft: '1em',
  } as React.CSSProperties

  const paragraphStyle = {
    marginTop: '1em',
  } as React.CSSProperties

  return (
    <Paper>
      <Grid container spacing={4}>
        <Grid item sm={12} md={8}>
          <Typography component="h2" className="module-title">Your profile</Typography>
          <TextField
            id="standard-name"
            label="Username"
            margin="normal"
            fullWidth={true}
          />
          <TextField
            id="standard-name"
            label="Name"
            margin="normal"
            fullWidth={true}
          />
          <TextField
            id="standard-name"
            label="Email"
            margin="normal"
            fullWidth={true}
          />
          <Save />

          <Typography component="h2" className="module-title">Security</Typography>
          <TextField
            id="standard-name"
            label="Old password"
            type="password"
            margin="normal"
            fullWidth={true}
          />
          <TextField
            id="standard-name"
            label="New password"
            type="password"
            margin="normal"
            fullWidth={true}
          />
          <TextField
            id="standard-name"
            label="Confirm new password"
            type="password"
            margin="normal"
            fullWidth={true}
          />
          <Typography style={paragraphStyle} paragraph={true} component="p"><Button variant="contained" color="inherit">Update password</Button>
              <Link style={linkStyle} href="#">I forgot my password</Link></Typography>
        </Grid>

        <Grid item sm={12} md={4}>
          <Typography component="p" align="center"><img src={ProfileImage} style={ProfileImageStyle} alt="" /><br />
          <Button variant="contained" color="default">Upload new picture</Button></Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default Content;
