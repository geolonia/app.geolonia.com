import React from "react";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import { __ } from "@wordpress/i18n";

import Save from "../custom/Save";
import defaultTeamIcon from "../custom/team.svg";
import Title from "../custom/Title";

const Content = () => {
  const styleDangerZone: React.CSSProperties = {
    border: "1px solid #ff0000",
    padding: "16px 24px"
  };

  const ProfileImageStyle: React.CSSProperties = {
    width: "250px",
    height: "auto",
    margin: "16px"
  };

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
          <TextField
            id="team-name"
            label={__("Name")}
            margin="normal"
            fullWidth={true}
          />
          <TextField
            id="team-description"
            label={__("Description")}
            margin="normal"
            multiline={true}
            rows={5}
            fullWidth={true}
          />
          <TextField
            id="team-url"
            label={__("URL")}
            margin="normal"
            fullWidth={true}
          />
          <TextField
            id="team-billing-email"
            label={__("Billing email")}
            value=""
            margin="normal"
            fullWidth={true}
          />
          <p className="mute">We’ll send receipts to this inbox.</p>

          <Save />
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography component="p" align="center">
            <img src={defaultTeamIcon} style={ProfileImageStyle} alt="" />
            <br />
            <Button variant="contained" color="default">
              {__("Upload new picture")}
            </Button>
          </Typography>
        </Grid>

        <Grid item xs={12} md={12}>
          <div style={styleDangerZone}>
            <Typography component="h3" color="secondary">
              {__("Danger Zone")}
            </Typography>
            <p>
              {__(
                "Once you delete a team, there is no going back. Please be certain. "
              )}
            </p>
            <Button variant="contained" color="secondary">
              {__("Delete")}
            </Button>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Content;
