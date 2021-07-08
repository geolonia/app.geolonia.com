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

import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Help from "../custom/Help";

// libs
import normalizeOrigin from "../../lib/normalize-origin";

const { REACT_APP_STAGE } = process.env;

type Meta = {
  name: string;
  isPublic: boolean;
  status: string;
};

type OwnProps = {
  geojsonId: string;
  name: string;
  isPublic: boolean;
  allowedOrigins: Array<string> | string;
  status: string;
  setGeoJsonMeta: ({
    name,
    isPublic,
    allowedOrigins,
    status
  }: {
    name: string;
    isPublic: boolean;
    allowedOrigins: Array<string> | string;
    status: string;
  }) => void;

  isPaidTeam: boolean;
  style: string;
};

type StateProps = { session: Geolonia.Session };
type Props = OwnProps & StateProps;

// const copyToClipBoard = (style: string) => {
//   const input = document.querySelector(
//     ".geolonia-geojson-api-endpoint"
//   ) as HTMLInputElement;
//   if (input) {
//     input.select();
//     clipboard.writeText(
//       `<div class="geolonia" data-geojson="${input.value}" style="${style}"></div>`
//     );
//   }
// };

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
  props: Props
): [boolean, (nextIsPublic: boolean) => void] => {
  const { session, geojsonId, isPublic, allowedOrigins, name, status, setGeoJsonMeta } = props;
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
          setGeoJsonMeta({ isPublic: draftIsPublic, allowedOrigins, name, status });
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
    allowedOrigins,
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
  const { session, geojsonId, isPublic, allowedOrigins, name, status, setGeoJsonMeta } = props;
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
          setGeoJsonMeta({ isPublic, name, allowedOrigins, status: draftStatus });
        });
    }
  }, [draftStatus, geojsonId, isPublic, allowedOrigins, name, session, setGeoJsonMeta, status]);
  return [draftStatus, setDraftStatus];
};

const GeoJSONMeta = (props: Props) => {
  // サーバーから取得してあるデータ
  const { geojsonId, name, isPublic, status } = props;
  const { session, setGeoJsonMeta } = props;

  // UI上での変更をリクエスト前まで保持しておくための State
  const [draftIsPublic, setDraftIsPublic] = usePublic(props);
  const [draftStatus, setDraftStatus] = useStatus(props);
  const [draftName, setDraftName] = React.useState(props.name);

  const [allowedOrigins, setAllowedOrigins] = React.useState("");
  const [saveStatus, setSaveStatus] = React.useState<false | "requesting" | "success" | "failure">(false);
  const onRequestError = () => setSaveStatus("failure");
  const propOrigins = (props || { allowedOrigins: [] }).allowedOrigins;
  
  // fire save name request
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
        setGeoJsonMeta({ isPublic, name: draftName, allowedOrigins, status });
      });
  };

  let saveDisabled = false
  if (typeof propOrigins === "string") {
    saveDisabled = allowedOrigins === propOrigins
  } else {
    saveDisabled = allowedOrigins === propOrigins.join("\n")
  }

  const onUpdateClick = () => {
    if (saveDisabled || !session) {
      return Promise.resolve();
    }

    setSaveStatus("requesting");

    const normalizedAllowedOrigins = allowedOrigins
      .split("\n")
      .filter(url => !!url)
      .map(origin => normalizeOrigin(origin));

    console.log(normalizedAllowedOrigins)
    return fetch(
      session,
      `https://api.geolonia.com/${REACT_APP_STAGE}/geojsons/${geojsonId}`,
      {
        method: "PUT",
        body: JSON.stringify({
          allowedOrigins: normalizedAllowedOrigins
        })
      }
    )
      .then(res => {
        if (res.status < 400) {
          return res.json();
        } else {
          // will be caught at <Save />
          setSaveStatus("failure");
          throw new Error();
        }
      })
      .then(() => {
        setSaveStatus("success");
        setGeoJsonMeta({ isPublic, name: draftName, allowedOrigins, status });
      });
  };

  const downloadDisabled = status === "draft" || !isPublic;
  const downloadUrl = `https://api.geolonia.com/${REACT_APP_STAGE}/geojsons/pub/${geojsonId}`;

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
              // NOTE: Billing feature
              // disabled={!props.isPaidTeam}
              disabled={true}
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
            {/* NOTE: Billing feature */}
            {/* {isPublic ? ( */}
            <p>
              {__(
                "Public features will be displayed publicly and anyone can download this features without API key."
              )}
            </p>
            {/* ) : (
              <p>
                {__("You can restrict the URLs that can use this GeoJSON API.")}
              </p>
            )} */}

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
            {/* NOTE: Billing feature */}
            {/* <p>
              <a href="#/team/billing">{__("Upgrade to Geolonia Team")}</a>
            </p> */}
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
          {!downloadDisabled && (
            <input
              disabled={downloadDisabled}
              className="geolonia-geojson-api-endpoint"
              value={downloadUrl}
              readOnly={true}
            />
          )}
          <p>
            <Button
              variant="contained"
              color="primary"
              size="large"
              style={{ width: "100%" }}
              onClick={() => {
                window
                  .fetch(downloadUrl)
                  .then(res => {
                    if (res.status < 400) {
                      return res.text();
                    } else {
                      throw new Error("");
                    }
                  })
                  .then(geojsonString => {
                    const element = document.createElement("a");
                    const file = new Blob([geojsonString], {
                      type: "application/geo+json"
                    });
                    element.href = URL.createObjectURL(file);
                    element.download = `${geojsonId}.geojson`;
                    document.body.appendChild(element); // Required for this to work in FireFox
                    element.click();
                    document.body.removeChild(element);
                  })
                  .catch(err => {
                    //
                  });
              }}
              disabled={downloadDisabled}
            >
              {__("Download")}
            </Button>
          </p>
          {!downloadDisabled && (
            <p style={{ textAlign: "center", fontSize: "90%" }}>
              {__("Or")}
              <br />
              <button className="copy-button" onClick={copyUrlToClipBoard}>
                {__("Copy endpoint URL to clipboard")}
              </button>
            </p>
          )}
        </Paper>
        {draftIsPublic && (
          <Paper className="geojson-title-description">
            <h3>{__("Access allowed URLs")}</h3>
            <p>{__("Please enter a URL to allow access to the map. To specify multiple URLs, insert a new line after each URL.")}</p>
            <TextField
              id="standard-name"
              label={__("URLs")}
              margin="normal"
              multiline={true}
              rows={5}
              placeholder="https://example.com"
              fullWidth={true}
              value={allowedOrigins}
              onChange={e => setAllowedOrigins(e.target.value)}
              disabled={saveStatus === "requesting"}
            />
            <Help>
              <Typography component="p">
                {__(
                  "URLs will be used for an HTTP referrer to restrict the URLs that can use an API key."
                )}
              </Typography>
              <ul>
                <li>
                  {__("Any page in a specific URL:")}{" "}
                  <strong>https://www.example.com</strong>
                </li>
                <li>
                  {__("Any subdomain:")} <strong>https://*.example.com</strong>
                </li>
                <li>
                  {__("A URL with a non-standard port:")}{" "}
                  <strong>https://example.com:*</strong>
                </li>
              </ul>
              <p>
                {__(
                  'Note: Wild card (*) will be matched to a-z, A-Z, 0-9, "-", "_".'
                )}
              </p>
            </Help>
            <Save
              onClick={onUpdateClick}
              onError={onRequestError}
              disabled={saveDisabled}
            />
          </Paper>
        )}
      </Grid>
    </Grid>
  );
};

export const mapStateToProps = (state: Geolonia.Redux.AppState): StateProps => {
  const { session } = state.authSupport;
  return { session };
};

export default connect(mapStateToProps)(GeoJSONMeta);
