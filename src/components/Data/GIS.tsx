import React from "react";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";

import {__, _x} from '@wordpress/i18n';
import Interweave from "interweave";

import Save from "../custom/Save";
import Delete from "../custom/Delete";
import Code from "../custom/Code";
import MapEditor from "../custom/GeoloniaMap";
import Title from "../custom/Title";

const Content = () => {
  const breadcrumbItems = [
    {
      title: "Home",
      href: "#/"
    },
    {
      title: __("API services"),
      href: "#/data"
    },
    {
      title: "Geolonia GIS",
      href: "#/data/gis"
    },
    {
      title: __("Dataset settings"),
      href: null
    }
  ];

  const mapStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid #dedede",
    margin: "0 0 1em 0"
  };

  const styleDangerZone: React.CSSProperties = {
    border: "1px solid #ff0000",
    marginTop: "10em",
    padding: "16px 24px"
  };

  const styleHelpText: React.CSSProperties = {
    fontSize: "0.9rem"
  };

  const cardStyle: React.CSSProperties = {
    marginBottom: "2em"
  };

  const StyleSaveButton: React.CSSProperties = {};

  const saveHandler = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {};

  const deleteHandler = (event: React.MouseEvent) => {};

  const mapAtts = {
    id: "map-editor",
    width: "100%",
    height: "400px",
    lat: parseFloat(_x('0', 'Default value of latitude for map')),
    lng: parseFloat(_x('0', 'Default value of longitude for map')),
    marker: 'off',
    zoom: 8,
    fullscreenControl: 'on',
    geolocateControl: 'on',
  }

  return (
    <div>
      <Title breadcrumb={breadcrumbItems} title={__("Dataset settings")}>
        {__(
          "You can manage and set the dataset, and get the the access point URL of dataset API."
        )}
      </Title>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>

          <div style={mapStyle}><MapEditor {...mapAtts} /></div>

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
              handler={deleteHandler}
              text1={__("Are you sure you want to delete this dataset?")}
              text2={__("Please type in the name of the dataset to confirm.")}
            />
          </div>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper style={cardStyle}>
            <FormControlLabel
              control={<Checkbox value="1" color="primary" />}
              label={__("Public")}
            />

            <Typography
              style={styleHelpText}
              component="p"
              color="textSecondary"
            >
              <Interweave
                content={__(
                  'Public features will be displayed on <a class="MuiTypography-colorPrimary" href="#">open data directory</a> and anyone can download this features without API key.'
                )}
              />
            </Typography>
            <Save handler={saveHandler} style={StyleSaveButton} />
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
        </Grid>
      </Grid>
    </div>
  );
};

export default Content;
