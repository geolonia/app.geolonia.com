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
import { connect } from "react-redux";
import Save from "../custom/Save";
import { AppState, Session } from "../../types";

const { REACT_APP_STAGE } = process.env;

type TypeGeoJsonMeta = {
  createAt: Date;
  data: GeoJSON.FeatureCollection;
  isPublic: boolean;
  name: string;
  updateAt: Date;
}

type Props = {
  publicGeoJson: boolean;
  setPublicGeoJson: Function;
  GeoJsonID: string | undefined;
  isPayedUser: boolean;
  geoJsonMeta: object | undefined;
  style: string;
};

type StateProps = {
  session: Session;
  teamId?: string;
};

const Content = (props: Props & StateProps) => {
  const [allowedOrigins, setAllowedOrigins] = React.useState("");
  const [name, setName] = React.useState<string>("");

  React.useEffect(() => {
    if (props.geoJsonMeta) {
      const meta = props.geoJsonMeta as TypeGeoJsonMeta
      setName(meta.name)
    }
  }, [props.geoJsonMeta])

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
      clipboard.writeText(`<div class="geolonia" data-geojson="${input.value}" style="${props.style}"></div>`)
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

  const onChangeHandler = (e: React.FormEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value)
  }

  const onSaveClick = () => {
    if(!props.GeoJsonID || !props.session) {
      return Promise.resolve()
    }

    const idToken = props.session.getIdToken().getJwtToken();
    return fetch(
      `https://api.geolonia.com/${REACT_APP_STAGE}/geojsons`,
      {
        method: 'POST',
        headers: {
          Authorization: idToken
        },
        body: JSON.stringify({
          id: props.GeoJsonID,
          name,
          isPublic: props.publicGeoJson,
        })
      }
    )
      .then(res => {
        if(res.status < 400) {
          return res.json()
        } else {
          // will be caught at <Save />
          throw new Error()
        }
      })
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

            <p><a href="#/team/billing">{__("Upgrade to Geolonia Team")}</a></p>
          </Paper>

          <Paper className="geojson-title-description">
            <h3>{__('Name')}</h3>
            <input type="text" value={name} onChange={onChangeHandler} />

            <Save onClick={onSaveClick} />
            <p>{__("Name of public GeoJSON will be displayed in public.")}</p>
          </Paper>
        </Grid>
        {props.GeoJsonID?
          <Grid item sm={8} xs={12}>
            <Paper>
              <h3>{__("API Endpoint")}</h3>
              <input className="geolonia-geojson-api-endpoint" value={`https://api.geolonia.com/v1/geojsons/${props.GeoJsonID}`} onChange={geoJsonChangeHandler} />
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
                  &nbsp;<a href="#/team/billing">{__("Upgrade to Geolonia Team")}</a></p>
            </Paper>
          </Grid> : <></>
        }
      </Grid>
    </>
  );
};

export const mapStateToProps = (state: AppState): StateProps => {
  const team = state.team.data[state.team.selectedIndex];
  const { session } = state.authSupport;
  if (team) {
    const { teamId } = team;
    return {
      session,
      teamId,
    };
  } else {
    return { session };
  }
};

export default connect(mapStateToProps)(Content);
