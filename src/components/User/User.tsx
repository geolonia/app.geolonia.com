import React from "react";

import Grid from "@material-ui/core/Grid";
import Security from "./security";
import Profile from "./profile";
import Avatar from "./avatar";
import Title from "../custom/Title";

const Content = () => {
  // const linkStyle: React.CSSProperties = {
  //   marginLeft: "1em"
  // };

  // const paragraphStyle: React.CSSProperties = {
  //   marginTop: "1em"
  // };

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
