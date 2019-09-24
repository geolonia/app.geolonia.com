import React from "react";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import PersonIcon from "@material-ui/icons/Person";
import Security from "./security";
import Profile from "./profile";
import Title from "../custom/Title";

const Content = () => {
  const ProfileImageStyle: React.CSSProperties = {
    width: "250px",
    height: "auto",
    fill: "#dedede"
  };

  const linkStyle: React.CSSProperties = {
    marginLeft: "1em"
  };

  const paragraphStyle: React.CSSProperties = {
    marginTop: "1em"
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
          <Profile />
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
