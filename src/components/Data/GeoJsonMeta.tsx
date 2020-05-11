import React from "react";

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Switch from "@material-ui/core/Switch";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockIcon from "@material-ui/icons/Lock";
import Button from "@material-ui/core/Button";
import * as clipboard from "clipboard-polyfill";
import { __ } from "@wordpress/i18n";
import { connect } from "react-redux";
import Save from "../custom/Save";
import fetch from "../../lib/fetch";
import { AppState, Session } from "../../types";

const { REACT_APP_STAGE } = process.env;

type Meta = {
  name: string;
  isPublic: boolean;
};

type Props = {
  geojsonId: string;
  name: string;
  isPublic: boolean;
  setGeoJsonMeta: ({
    name,
    isPublic
  }: {
    name: string;
    isPublic: boolean;
  }) => void;

  isPayedUser: boolean;
  style: string;
};

type StateProps = {
  session: Session;
  teamId?: string;
};

const copyToClipBoard = (style: string) => {
  const input = document.querySelector(
    ".geolonia-geojson-api-endpoint"
  ) as HTMLInputElement;
  if (input) {
    input.select();
    clipboard.writeText(
      `<div class="geolonia" data-geojson="${input.value}" style="${style}"></div>`
    );
  }
};

const copyUrlToClipBoard = () => {
  const input = document.querySelector(
    ".geolonia-geojson-api-endpoint"
  ) as HTMLInputElement;
  if (input) {
    input.select();
    clipboard.writeText(input.value);
  }
};

const Content = (props: Props & StateProps) => {
  const { session, geojsonId, name, isPublic, setGeoJsonMeta } = props;

  const [draftName, setDraftName] = React.useState(name);
  const [draftIsPublic, setDraftIsPublic] = React.useState(isPublic);

  React.useEffect(() => {
    if (isPublic !== draftIsPublic) {
      fetch(
        session,
        `https://api.geolonia.com/${REACT_APP_STAGE}/geojsons/${geojsonId}`,
        {
          method: "PUT",
          body: JSON.stringify({ isPublic: draftIsPublic, name })
        }
      )
        .then(res => {
          if (res.status < 400) {
            return res.json();
          } else {
            throw new Error();
          }
        })
        .then(() => {
          setGeoJsonMeta({ isPublic: draftIsPublic, name });
        })
        .catch(() => {});
    }
  }, [draftIsPublic, geojsonId, isPublic, name, session, setGeoJsonMeta]);

  const geoJsonChangeHandler = () => {
    return;
  };

  const saveHandler = (draftName: string) => {
    if (!session) {
      return Promise.resolve();
    }

    return fetch(
      session,
      `https://api.geolonia.com/${REACT_APP_STAGE}/geojsons/${geojsonId}`,
      {
        method: "PUT",
        body: JSON.stringify({
          name: draftName,
          isPublic: isPublic
        })
      }
    )
      .then(res => {
        if (res.status < 400) {
          return res.json();
        } else {
          // will be caught at <Save />
          throw new Error();
        }
      })
      .then(() => {
        setGeoJsonMeta({ isPublic, name: draftName });
      });
  };

  return (
    <Grid className="geojson-meta" container spacing={2}>
      <Grid item sm={4} xs={12}>
        <Paper className="geojson-title-description">
          <Switch
            checked={draftIsPublic}
            onChange={e => {
              setDraftIsPublic(e.target.checked);
            }}
            disabled={!props.isPayedUser}
            inputProps={{ "aria-label": "primary checkbox" }}
            color="primary"
          />
          {isPublic ? (
            <span className="is-public">
              <LockOpenIcon fontSize="small" />
              Public
            </span>
          ) : (
            <span className="is-public">
              <LockIcon fontSize="small" />
              Private
            </span>
          )}
          {isPublic ? (
            <p>{__("Anyone can access this GeoJSON API.")}</p>
          ) : (
            <p>
              {__("You can restrict the URLs that can use this GeoJSON API.")}
            </p>
          )}
          <p>
            <a href="#/team/billing">{__("Upgrade to Geolonia Team")}</a>
          </p>
        </Paper>

        <Paper className="geojson-title-description">
          <h3>{__("Name")}</h3>
          <input
            type="text"
            value={draftName}
            onChange={e => setDraftName(e.currentTarget.value)}
          />

          <Save
            onClick={() => saveHandler(draftName)}
            disabled={draftName === name}
          />
          <p>{__("Name of public GeoJSON will be displayed in public.")}</p>
        </Paper>
      </Grid>
      <Grid item sm={8} xs={12}>
        <Paper className="geojson-title-description">
          <h3>{__("Download GeoJSON")}</h3>
          <p>
            <Button
              variant="contained"
              color="primary"
              size="large"
              style={{ width: "100%" }}
              href={`https://api.geolonia.com/${REACT_APP_STAGE}/geojsons/pub/${geojsonId}`}
            >
              {__("Download")}
            </Button>
          </p>
        </Paper>

        <Paper className="geojson-title-description">
          <h3>{__("Private Endpoint")}</h3>
          <>
            <input
              disabled={isPublic}
              className="geolonia-geojson-api-endpoint"
              value={`https://api.geolonia.com/${REACT_APP_STAGE}/geojsons/private/${geojsonId}`}
              onChange={geoJsonChangeHandler}
            />
            <p>
              <Button
                disabled={isPublic}
                variant="contained"
                color="primary"
                size="large"
                style={{ width: "100%" }}
                onClick={() => copyToClipBoard(props.style)}
              >
                {__("Copy embed code to clipboard")}
              </Button>
            </p>
            {!isPublic ? (
              <p style={{ textAlign: "center", fontSize: "90%" }}>
                {__("Or")}
                <br />

                <button className="copy-button" onClick={copyUrlToClipBoard}>
                  {__("Copy endpoint URL to clipboard")}
                </button>
              </p>
            ) : null}
          </>
        </Paper>
      </Grid>
    </Grid>
  );
};

export const mapStateToProps = (state: AppState): StateProps => {
  const team = state.team.data[state.team.selectedIndex];
  const { session } = state.authSupport;
  if (team) {
    const { teamId } = team;
    return {
      session,
      teamId
    };
  } else {
    return { session };
  }
};

export default connect(mapStateToProps)(Content);
