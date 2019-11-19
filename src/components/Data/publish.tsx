import React from "react";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Paper from "@material-ui/core/Paper";
import Interweave from "interweave";
import Save from "../custom/Save";
import Code from "../custom/Code";

import { __ } from "@wordpress/i18n";

const styleHelpText: React.CSSProperties = {
  fontSize: "0.9rem"
};

const cardStyle: React.CSSProperties = {
  marginBottom: "2em"
};

const StyleSaveButton: React.CSSProperties = {};

const saveHandler = (
  event: React.MouseEvent<HTMLButtonElement, MouseEvent>
) => {
  return Promise.resolve();
};

export const Publish = () => {
  return (
    <>
      <Paper style={cardStyle}>
        <FormControlLabel
          control={<Checkbox value="1" color="primary" />}
          label={__("Public")}
        />

        <Typography style={styleHelpText} component="p" color="textSecondary">
          <Interweave
            content={__(
              'Public features will be displayed on <a class="MuiTypography-colorPrimary" href="#">open data directory</a> and anyone can download this features without API key.'
            )}
          />
        </Typography>
        <Save onClick={saveHandler} style={StyleSaveButton} />
      </Paper>

      <Paper style={cardStyle}>
        <Typography component="h2" className="module-title">
          {__("Private URL")}
        </Typography>
        <Code>https://example.com/...</Code>
        <Typography component="h2" className="module-title">
          {__("Public URL")}
        </Typography>
        <Code>https://example.com/...</Code>
      </Paper>
    </>
  );
};

export default Publish;
