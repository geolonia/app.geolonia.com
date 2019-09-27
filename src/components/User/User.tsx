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
import Profile from "./profile";
import Avatar from "./avatar";
import Title from "../custom/Title";

const Content = () => {
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
          <Profile />
          <Security />
        </Grid>

        <Grid item sm={12} md={4}>
          <Avatar />
        </Grid>
      </Grid>
    </div>
  );
};

export default Content;
