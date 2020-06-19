import React from "react";

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Switch from "@material-ui/core/Switch";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockIcon from "@material-ui/icons/Lock";
import EditIcon from "@material-ui/icons/Edit";
import DoneIcon from "@material-ui/icons/Done";
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
  status: string;
};

type Props = {
  geojsonId: string;
  name: string;
  isPublic: boolean;
  status: string;
  setGeoJsonMeta: ({
    name,
    isPublic,
    status
  }: {
    name: string;
    isPublic: boolean;
    status: string;
  }) => void;

  isPaidTeam: boolean;
  style: string;
};

type StateProps = { session: Session };

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

const usePublic = (
  props: Props & StateProps
): [boolean, (nextIsPublic: boolean) => void] => {
  const { session, geojsonId, isPublic, name, status, setGeoJsonMeta } = props;
  const [draftIsPublic, setDraftIsPublic] = React.useState(props.isPublic);

  React.useEffect(() => {
    if (isPublic !== draftIsPublic) {
      fetch(
        session,
        `https://api.geolonia.com/${REACT_APP_STAGE}/geojsons/${geojsonId}`,
        {
          method: "PUT",
          body: JSON.stringify({ isPublic: draftIsPublic, name: name })
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
          setGeoJsonMeta({ isPublic: draftIsPublic, name, status });
        })
        .catch(() => {
          // 意図せずリクエストが失敗している
          // 元に戻す
          setDraftIsPublic(isPublic);
        });
    }
  }, [
    draftIsPublic,
    geojsonId,
    isPublic,
    name,
    session,
    setGeoJsonMeta,
    status
  ]);

  return [draftIsPublic, setDraftIsPublic];
};

const useStatus = (
  props: Props & StateProps
): [string, (nextStatus: string) => void] => {
  const { session, geojsonId, isPublic, name, status, setGeoJsonMeta } = props;
  const [draftStatus, setDraftStatus] = React.useState(props.status);

  React.useEffect(() => {
    if (status !== draftStatus) {
      fetch(
        session,
        `https://api.geolonia.com/${REACT_APP_STAGE}/geojsons/${geojsonId}`,
        {
          method: "PUT",
          body: JSON.stringify({ isPublic, name, status: draftStatus })
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
          setGeoJsonMeta({ isPublic, name, status: draftStatus });
        })
        .catch(() => {});
    }
  }, [draftStatus, geojsonId, isPublic, name, session, setGeoJsonMeta, status]);
  return [draftStatus, setDraftStatus];
};

const Content = (props: Props & StateProps) => {
  const { session, geojsonId, name, isPublic, status, setGeoJsonMeta } = props;

  const [draftIsPublic, setDraftIsPublic] = usePublic(props);
  const [draftStatus, setDraftStatus] = useStatus(props);

  const [draftName, setDraftName] = React.useState(name);

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
        setGeoJsonMeta({ isPublic, name: draftName, status });
      });
  };

  return (
    <Grid className="geojson-meta" container spacing={2}>
      <Grid item sm={4} xs={12}>
        <Paper className="geojson-title-description">
          <div>
            <Switch
              checked={draftIsPublic}
              onChange={e => {
                setDraftIsPublic(e.target.checked);
              }}
              disabled={!props.isPaidTeam}
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
          </div>
          <div>
            {isPublic ? (
              <p>{__("Anyone can access this GeoJSON API.")}</p>
            ) : (
              <p>
                {__("You can restrict the URLs that can use this GeoJSON API.")}
              </p>
            )}

            <Switch
              checked={draftStatus === "published"}
              onChange={() => {
                setDraftStatus(
                  draftStatus === "published" ? "draft" : "published"
                );
              }}
              inputProps={{ "aria-label": "primary checkbox" }}
              color="primary"
            />
            {draftStatus === "published" ? (
              <span className="is-public">
                <DoneIcon fontSize="small" />
                Published
              </span>
            ) : (
              <span className="is-public">
                <EditIcon fontSize="small" />
                Draft
              </span>
            )}

            {status === "published" ? (
              <p>{__("Datasets are published now.")}</p>
            ) : (
              <p>{__("Datasets status are draft now.")}</p>
            )}
            <p>
              <a href="#/team/billing">{__("Upgrade to Geolonia Team")}</a>
            </p>
          </div>
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
          <input
            disabled={!isPublic}
            className="geolonia-geojson-api-endpoint"
            value={`https://api.geolonia.com/${REACT_APP_STAGE}/geojsons/pub/${geojsonId}`}
          />
          <p>
            <Button
              variant="contained"
              color="primary"
              size="large"
              style={{ width: "100%" }}
              onClick={() => {
                window
                  .fetch(
                    `https://api.geolonia.com/${REACT_APP_STAGE}/geojsons/pub/${geojsonId}`
                  )
                  .then(res => {
                    if (res.status < 400) {
                      return res.json();
                    } else {
                      throw new Error("");
                    }
                  })
                  .then(geojson => {
                    const element = document.createElement("a");
                    const file = new Blob([geojson], { type: "text/plain" });
                    element.href = URL.createObjectURL(file);
                    element.download = `${geojsonId}.geojson`;
                    document.body.appendChild(element); // Required for this to work in FireFox
                    element.click();
                    document.body.removeChild(element);
                  });
              }}
              disabled={status === "draft" || !isPublic}
            >
              {__("Download")}
            </Button>
          </p>
          {isPublic && (
            <p style={{ textAlign: "center", fontSize: "90%" }}>
              {__("Or")}
              <br />
              <button className="copy-button" onClick={copyUrlToClipBoard}>
                {__("Copy endpoint URL to clipboard")}
              </button>
            </p>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export const mapStateToProps = (state: AppState): StateProps => {
  const { session } = state.authSupport;
  return { session };
};

export default connect(mapStateToProps)(Content);
