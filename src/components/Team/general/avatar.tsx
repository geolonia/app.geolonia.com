import React from "react";

// Components
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import defaultTeamIcon from "../../custom/team.svg";

// utils
import { __ } from "@wordpress/i18n";

const Content = () => {
  const ProfileImageStyle: React.CSSProperties = {
    width: "250px",
    height: "auto",
    margin: "16px"
  };

  return (
    <>
      <Typography component="p" align="center">
        <img src={defaultTeamIcon} style={ProfileImageStyle} alt="" />
        <br />
        <Button variant="contained" color="default">
          {__("Upload new picture")}
        </Button>
      </Typography>
    </>
  );
};

export default Content;
