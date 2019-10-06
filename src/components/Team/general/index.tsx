import React from "react";

// Components
import Grid from "@material-ui/core/Grid";
import Title from "../../custom/Title";
import Fields from "./fields";
import Avatar from "./avatar";
import Delete from "./delete";

// utils
import { __ } from "@wordpress/i18n";

const Content = () => {
  const breadcrumbItems = [
    {
      title: "Home",
      href: "#/"
    },
    {
      title: __("Team settings"),
      href: "#/team"
    },
    {
      title: __("General"),
      href: null
    }
  ];

  return (
    <div>
      <Title title={__("General")} breadcrumb={breadcrumbItems}>
        {__(
          "All users on the Geolonia service belong to one of the teams, and a team with the same name as the user is automatically generated when you sign up. You can switch teams in the pull-down menu at the top left of the sidebar."
        )}
      </Title>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Fields />
        </Grid>

        <Grid item xs={12} md={4}>
          <Avatar />
        </Grid>

        <Grid item xs={12} md={12}>
          <Delete />
        </Grid>
      </Grid>
    </div>
  );
};

export default Content;
