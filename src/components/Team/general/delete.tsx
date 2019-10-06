import React from "react";

// Components
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

// utils
import { __ } from "@wordpress/i18n";

const Content = () => {
  // parameters
  const styleDangerZone: React.CSSProperties = {
    border: "1px solid #ff0000",
    padding: "16px 24px"
  };

  return (
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
  );
};

export default Content;
