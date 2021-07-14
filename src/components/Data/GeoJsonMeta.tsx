import React, { useCallback, useEffect, useState } from "react";

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Switch from "@material-ui/core/Switch";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockIcon from "@material-ui/icons/Lock";
import EditIcon from "@material-ui/icons/Edit";
import DoneIcon from "@material-ui/icons/Done";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import * as clipboard from "clipboard-polyfill";
import { __, sprintf } from "@wordpress/i18n";
import { connect } from "react-redux";
import Save from "../custom/Save";
import Help from "../custom/Help";
import fetch from "../../lib/fetch";
import normalizeOrigin from "../../lib/normalize-origin";
import { buildApiUrl } from "../../lib/api";
import { GeoJsonMetaSetter } from "./GeoJson/hooks/use-geojson";
import Interweave from "interweave";

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
  allowedOrigins: string[];
  status: string;
  setGeoJsonMeta: GeoJsonMetaSetter;

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

const embedCode = sprintf(
  '<script type="text/javascript" src="%s/%s/embed?geolonia-api-key=%s"></script>',
  'https://cdn.geolonia.com', // `api.geolonia.com/{stage}/embed` has been deprecated.
  process.env.REACT_APP_STAGE,
  'YOUR-API-KEY'
);
const embedCSS = `.geolonia {
width: 100%;
height: 400px;
}`;

const styleH3: React.CSSProperties = {
  marginTop: "1em"
};

const sidebarStyle: React.CSSProperties = {
  marginBottom: "2em",
  overflowWrap: "break-word"
};

const styleTextarea: React.CSSProperties = {
  width: "100%",
  color: "#555555",
  fontFamily: "monospace",
  resize: "none",
  height: "5rem",
  padding: "8px"
};

const copyToClipBoard = (cssSelector: string) => {
  const input = document.querySelector(cssSelector) as HTMLInputElement;
  if (input) {
    input.select();
    clipboard.writeText(input.value);
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
  props: Props
): [boolean, (nextIsPublic: boolean) => void] => {
  const { session, geojsonId, isPublic, allowedOrigins, name, status, setGeoJsonMeta } = props;
  const [draftIsPublic, setDraftIsPublic] = useState(props.isPublic);

  useEffect(() => {
    if (isPublic === draftIsPublic) {
      return;
    }

    (async () => {
      const rawResp = await fetch(
        session,
        buildApiUrl(`/geojsons/${geojsonId}`),
        {
          method: "PUT",
          body: JSON.stringify({ isPublic: draftIsPublic, allowedOrigins, name, status })
        }
      );
      if (rawResp.status >= 400) {
        setDraftIsPublic(isPublic);
        return;
      }

      const resp = await rawResp.json();
      setGeoJsonMeta({
        isPublic: resp.body._source.isPublic,
        name: resp.body._source.name,
        allowedOrigins: resp.body._source.allowedOrigins,
        status: resp.body._source.status,
        gvp_status: resp.body._source.gvp_status,
      });
    })();
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
  const [ draftStatus, setDraftStatus ] = useState(props.status);

  useEffect(() => {
    if (status === draftStatus) {
      return;
    }

    (async () => {
      const rawResp = await fetch(
        session,
        buildApiUrl(`/geojsons/${geojsonId}`),
        {
          method: "PUT",
          body: JSON.stringify({ isPublic, name, allowedOrigins, status: draftStatus })
        }
      );

      if (rawResp.status >= 400) {
        throw new Error(`HTTP error`);
      }

      const resp = await rawResp.json();
      setGeoJsonMeta({
        isPublic: resp.body._source.isPublic,
        name: resp.body._source.name,
        allowedOrigins: resp.body._source.allowedOrigins,
        status: resp.body._source.status,
        gvp_status: resp.body._source.gvp_status,
      });
    })();
  }, [
    draftStatus, geojsonId, isPublic, allowedOrigins, name, session, setGeoJsonMeta, status
  ]);

  return [ draftStatus, setDraftStatus ];
};

const GeoJSONMeta = (props: Props) => {
  // サーバーから取得してあるデータ
  const { geojsonId, name, isPublic, allowedOrigins, status } = props;
  const { session, setGeoJsonMeta } = props;

  // UI上での変更をリクエスト前まで保持しておくための State
  const [draftIsPublic, setDraftIsPublic] = usePublic(props);
  const [draftStatus, setDraftStatus] = useStatus(props);
  const [draftName, setDraftName] = useState(props.name);
  const [draftAllowedOrigins, setDraftAllowedOrigins] = useState("");

  const [saveStatus, setSaveStatus] = useState<false | "requesting" | "success" | "failure">(false);
  const onRequestError = () => setSaveStatus("failure");

  // effects
  useEffect(() => {
    if (allowedOrigins) {
      setDraftAllowedOrigins(allowedOrigins.join("\n"));
    }
  }, [allowedOrigins]);

  // fire save name request
  const saveHandler = useCallback(async (draftName: string) => {
    if (!session) {
      return;
    }

    const rawResp = await fetch(
      session,
      buildApiUrl(`/geojsons/${geojsonId}`),
      {
        method: "PUT",
        body: JSON.stringify({
          name: draftName,
          isPublic,
          allowedOrigins,
          status
        })
      }
    );
    if (rawResp.status >= 400) {
      throw new Error();
    }
    // const resp = await rawResp.json();
    setGeoJsonMeta({ isPublic, name: draftName, allowedOrigins, status });
  }, [allowedOrigins, geojsonId, isPublic, session, setGeoJsonMeta, status]);

  let saveDisabled = false

  if (allowedOrigins) {
    saveDisabled = draftAllowedOrigins === allowedOrigins.join("\n")
  }

  const onUpdateClick = useCallback(() => {
    if (saveDisabled || !session) {
      return Promise.resolve();
    }

    setSaveStatus("requesting");

    const normalizedAllowedOrigins = draftAllowedOrigins
      .split("\n")
      .filter(url => !!url)
      .map(origin => normalizeOrigin(origin));

    return fetch(
      session,
      `https://api.geolonia.com/${REACT_APP_STAGE}/geojsons/${geojsonId}`,
      {
        method: "PUT",
        body: JSON.stringify({
          isPublic,
          name,
          allowedOrigins: normalizedAllowedOrigins,
          status
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
        setGeoJsonMeta({ isPublic, name, allowedOrigins: normalizedAllowedOrigins, status });
      });
  }, [draftAllowedOrigins, geojsonId, isPublic, name, saveDisabled, session, status, setGeoJsonMeta])

  const downloadDisabled = status === "draft" || !isPublic;
  const downloadUrl = buildApiUrl(`/geojsons/pub/${geojsonId}`);

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
      <Paper style={sidebarStyle}>
        <Typography component="h2" className="module-title">
          {__("Add the map to your site")}
        </Typography>
        <Typography component="h3" style={styleH3}>
          {__("Step 1")}
        </Typography>
        <p>
          <Interweave
            content={__(
              "Include the following code before closing tag of the <code>&lt;body /&gt;</code> in your HTML file."
            )}
          />
        </p>
        <textarea
          className="api-key-embed-code"
          style={styleTextarea}
          value={embedCode}
          readOnly={true}
        ></textarea>
        <p>
          <Button
            variant="contained"
            color="primary"
            size="large"
            style={{ width: "100%" }}
            onClick={() => copyToClipBoard(".api-key-embed-code")}
          >
            {__("Copy to Clipboard")}
          </Button>
        </p>
        <Typography component="h3" style={styleH3}>
          {__("Step 2")}
        </Typography>
        <p>
          {__(
            "Click following button and get HTML code where you want to place the map."
          )}
        </p>
        <p>
          <Button
            className="launch-get-geolonia"
            variant="contained"
            color="primary"
            size="large"
            style={{ width: "100%" }}
          >
            {__("Get HTML")}
          </Button>
        </p>
        <Typography component="h3" style={styleH3}>
          {__("Step 3")}
        </Typography>
        <p>{__("Adjust the element size.")}</p>
        <textarea
          className="api-key-embed-css"
          style={styleTextarea}
          value={embedCSS}
          readOnly={true}
        ></textarea>
        <p>
          <Button
            variant="contained"
            color="primary"
            size="large"
            style={{ width: "100%" }}
            onClick={() => copyToClipBoard(".api-key-embed-css")}
          >
            {__("Copy to Clipboard")}
          </Button>
        </p>
      </Paper>
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
              value={draftAllowedOrigins}
              onChange={e => setDraftAllowedOrigins(e.target.value)}
              disabled={saveStatus === "requesting"}
            />
            <Help>
              <Typography component="p">
                {__(
                  "Only requests that come from the URLs specified here will be allowed."
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
