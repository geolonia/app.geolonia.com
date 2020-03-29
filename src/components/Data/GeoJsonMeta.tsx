import React from "react";

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import LockIcon from '@material-ui/icons/Lock';
import Button from "@material-ui/core/Button";
import * as clipboard from 'clipboard-polyfill'
import TextField from "@material-ui/core/TextField";
import { __ } from "@wordpress/i18n";

import Save from "../custom/Save";

type Props = {
  publicGeoJson: boolean;
  setPublicGeoJson: Function;
  GeoJsonID: string | undefined;
  isPayedUser: boolean;
};

const Content = (props: Props) => {
  const [allowedOrigins, setAllowedOrigins] = React.useState("");

  const handlePublicGeoJson = () => {
    if (true === props.publicGeoJson) {
      props.setPublicGeoJson(false)
    } else {
      props.setPublicGeoJson(true)
    }
  }

  const copyToClipBoard = () => {
    const input = document.querySelector(".geolonia-geojson-api-endpoint") as HTMLInputElement
    if (input) {
      input.select()
      clipboard.writeText(`<div class="geolonia" data-geojson="${input.value}">`)
    }
  }

  const copyUrlToClipBoard = () => {
    const input = document.querySelector(".geolonia-geojson-api-endpoint") as HTMLInputElement
    if (input) {
      input.select()
      clipboard.writeText(input.value)
    }
  }

  const geoJsonChangeHandler = () => {
    return;
  }

  return (
    <>
      <Grid className="geojson-meta" container spacing={2}>
        <Grid item sm={4} xs={12}>
          <Paper>
            <Switch
              checked={props.publicGeoJson}
              onChange={handlePublicGeoJson}
              disabled={!props.isPayedUser}
              color="primary"
            />  {props.publicGeoJson? <span className="is-public"><LockOpenIcon fontSize="small" />Public</span>
                      : <span className="is-public"><LockIcon fontSize="small" />Private</span>}
            {props.publicGeoJson?
              <p>{__("Anyone can access this GeoJSON API.")}</p>:
              <p>{__("You can restrict the URLs that can use this GeoJSON API.")}</p>
            }

            <p>{__("You can change privacy of this GeoJSON API as a Pro.")}</p>
            <p><a href="#/team/billing">{__("Become a Pro")}</a></p>
          </Paper>

          <Paper className="geojson-title-description">
            <h3>{__('Name')}</h3>
            <input type="text"/>
            <h3>{__('Description')}</h3>
            <textarea></textarea>

            <Save />
            <p>{__("Name and Description of public GeoJSON will be displayed in public.")}</p>
          </Paper>
        </Grid>
        {props.GeoJsonID?
          <Grid item sm={8} xs={12}>
            <Paper>
              <h3>{__("API Endpoint")}</h3>
              <input className="geolonia-geojson-api-endpoint" value={`https://api.geolonia.com/v1/geojson/${props.GeoJsonID}`} onChange={geoJsonChangeHandler} />
              <p><Button variant="contained" color="primary" size="large" style={{width: "100%"}} onClick={() => copyToClipBoard() }>{__("Copy embed code to clipboard")}</Button></p>
              <p style={{textAlign: "center", fontSize: "90%"}}>{__("Or")}<br /><button className="copy-button" onClick={copyUrlToClipBoard}>{__("Copy endpoint URL to clipboard")}</button></p>
              <TextField
                label={__("URLs")}
                margin="normal"
                multiline={true}
                rows={5}
                placeholder="https://example.com"
                fullWidth={true}
                value={allowedOrigins}
                onChange={e => setAllowedOrigins(e.target.value)}
                disabled={props.publicGeoJson}
              />
              <p><Button variant="contained" color="primary" size="large" style={{width: "100%"}} disabled={props.publicGeoJson}>{__("Save")}</Button></p>
              <p>{__("URLs will be used for an HTTP referrer to restrict the URLs that can use this GeoJSON API.")}
                  &nbsp;<a href="#/team/billing">{__("Become a Pro")}</a></p>
            </Paper>
          </Grid> : <></>
        }
      </Grid>
    </>
  );
};

export default Content;
