import React from "react";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";
import PersonIcon from "@material-ui/icons/Person";

import Save from "../custom/Save";
import Security from "./security";

const Content = () => {
  const ProfileImageStyle: React.CSSProperties = {
    width: "250px",
    height: "auto",
    fill: "#dedede"
  };

  return (
    <Paper>
      <Grid container spacing={4}>
        <Grid item sm={12} md={8}>
          <Typography component="h2" className="module-title">
            Your profile
          </Typography>
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

          <Security></Security>
        </Grid>

        <Grid item sm={12} md={4}>
          <Typography component="p" align="center">
            <PersonIcon style={ProfileImageStyle} />
            <br />
            <Button variant="contained" color="default">
              Upload new picture
            </Button>
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Content;
