import React from "react";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Interweave from "interweave";
import Delete from "../custom/Delete";

import { __ } from "@wordpress/i18n";

const styleDangerZone: React.CSSProperties = {
  border: "1px solid #ff0000",
  marginTop: "10em",
  padding: "16px 24px"
};

const styleHelpText: React.CSSProperties = {
  fontSize: "0.9rem"
};

const deleteHandler = () => Promise.resolve();

export const Fields = () => {
  return (
    <>
      <TextField
        id="standard-name"
        label={__("Name")}
        margin="normal"
        fullWidth={true}
      />
      <TextField
        id="standard-name"
        label={__("Description")}
        margin="normal"
        multiline={true}
        rows={5}
        fullWidth={true}
      />
      <TextField
        id="standard-name"
        label={__("URLs")}
        margin="normal"
        multiline={true}
        rows={5}
        placeholder="https://example.com"
        fullWidth={true}
      />

      <Typography style={styleHelpText} component="p" color="textSecondary">
        <Interweave
          content={__(
            "Each URLs will be used as a value of <code>Access-Control-Allow-Origin</code> header for CORS. Please enter a URL on a new line."
          )}
        />
      </Typography>

      <div style={styleDangerZone}>
        <Typography component="h3" color="secondary">
          {__("Danger Zone")}
        </Typography>
        <p>
          {__(
            "Once you delete a API key, there is no going back. Please be certain."
          )}
        </p>
        <Delete
          onClick={deleteHandler}
          onFailure={() => void 0}
          errorMessage={"some error"}
          text1={__("Are you sure you want to delete this dataset?")}
          text2={__("Please type in the name of the dataset to confirm.")}
        />
      </div>
    </>
  );
};

export default Fields;
