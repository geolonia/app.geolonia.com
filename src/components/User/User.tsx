import React from "react";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import PersonIcon from "@material-ui/icons/Person";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Security from "./security";
import Save from "../custom/Save";
import Title from "../custom/Title";

const Content = () => {
  const ProfileImageStyle: React.CSSProperties = {
    width: "250px",
    height: "auto",
    fill: "#dedede"
  };

  const selectStyle: React.CSSProperties = {
    marginTop: "16px",
    marginBottom: "8px"
  };

  const breadcrumbItems = [
    {
      title: "Home",
      href: "#/"
    },
    {
      title: "Your profile",
      href: null
    }
  ];

  return (
    <div>
      <Title title="Your profile" breadcrumb={breadcrumbItems}>
        You can update your profile and security.
      </Title>

      <Grid container spacing={4}>
        <Grid item sm={12} md={8}>
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

          <FormControl fullWidth={true} style={selectStyle}>
            <InputLabel htmlFor="select-language">Language</InputLabel>
            <Select id="select-language" fullWidth={true}>
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="ja">日本語</MenuItem>
            </Select>
          </FormControl>

          <Save />

          <Security />
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
    </div>
  );
};

export default Content;
