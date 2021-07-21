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
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
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

const { REACT_APP_STAGE, REACT_APP_TILE_SERVER } = process.env;

type OwnProps = {
  geojsonId: string;
  name: string;
  isPublic: boolean;
  allowedOrigins: string[];
  status: string;
  teamId: string;
  setGeoJsonMeta: GeoJsonMetaSetter;

  isPaidTeam: boolean;
  primaryApiKeyId: string | undefined;
  style?: string;
};

type StateProps = { session: Geolonia.Session, mapKeys: Geolonia.Key[] };
type Props = OwnProps & StateProps;

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
  height: "2.5rem",
  padding: "8px"
};

const copyToClipBoard = (cssSelector: string) => {
  const input = document.querySelector(cssSelector) as HTMLInputElement;
  if (input) {
    input.select();
    clipboard.writeText(input.value);
  }
};

const usePublic = (
  props: Props
): [boolean, (nextIsPublic: boolean) => void] => {
  const { session, geojsonId, isPublic, allowedOrigins, name, status, primaryApiKeyId, setGeoJsonMeta } = props;
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
          body: JSON.stringify({ isPublic: draftIsPublic, allowedOrigins, name, status, primaryApiKeyId })
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
        teamId: resp.body._source.teamId,
        primaryApiKeyId: resp.body._source.primaryApiKeyId,
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
    status,
    primaryApiKeyId
  ]);

  return [draftIsPublic, setDraftIsPublic];
};

const useStatus = (
  props: Props & StateProps
): [string, (nextStatus: string) => void] => {
  const { session, geojsonId, isPublic, allowedOrigins, name, status, primaryApiKeyId, setGeoJsonMeta } = props;
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
          body: JSON.stringify({ isPublic, name, allowedOrigins, status: draftStatus, primaryApiKeyId })
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
        teamId: resp.body._source.teamId,
        primaryApiKeyId: resp.body._source.primaryApiKeyId,
      });
    })();
  }, [
    draftStatus, geojsonId, isPublic, allowedOrigins, name, session, setGeoJsonMeta, status, primaryApiKeyId
  ]);

  return [ draftStatus, setDraftStatus ];
};

const GeoJSONMeta = (props: Props) => {
  // サーバーから取得してあるデータ
  const { geojsonId, name, isPublic, allowedOrigins, status, teamId, mapKeys, primaryApiKeyId } = props;
  const { session, setGeoJsonMeta } = props;

  // UI上での変更をリクエスト前まで保持しておくための State
  const [draftIsPublic, setDraftIsPublic] = usePublic(props);
  const [draftStatus, setDraftStatus] = useStatus(props);
  const [draftName, setDraftName] = useState(props.name);
  const [draftAllowedOrigins, setDraftAllowedOrigins] = useState("");

  const [saveStatus, setSaveStatus] = useState<false | "requesting" | "success" | "failure">(false);
  const onRequestError = () => setSaveStatus("failure");

  const [apiKeyId, setApiKeyId] = useState(primaryApiKeyId);
  const [apiKeyIdAllowedOrigins, setApiKeyIdAllowedOrigins] = useState<string[] | undefined>([]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://geolonia.github.io/get-geolonia/app.js";
    document.body.appendChild(script);
  }, []);

  // effects
  useEffect(() => {
    if (allowedOrigins) {
      setDraftAllowedOrigins(allowedOrigins.join("\n"));
    }
  }, [allowedOrigins]);

  useEffect(() => {
    const allowedOrigins = getApiKeyIdAllowedOrigins(mapKeys, primaryApiKeyId)
    setApiKeyIdAllowedOrigins(allowedOrigins)
  }, [mapKeys, primaryApiKeyId])

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
          status,
          primaryApiKeyId
        })
      }
    );
    if (rawResp.status >= 400) {
      throw new Error();
    }
    // const resp = await rawResp.json();
    setGeoJsonMeta({ isPublic, name: draftName, allowedOrigins, status, teamId, primaryApiKeyId });
  }, [allowedOrigins, geojsonId, isPublic, session, setGeoJsonMeta, status, teamId, primaryApiKeyId]);

  let saveDisabled = false

  if (allowedOrigins) {
    saveDisabled = draftAllowedOrigins === allowedOrigins.join("\n")
  }

  const onUpdateClick = useCallback(async () => {
    if (saveDisabled || !session) {
      return Promise.resolve();
    }

    setSaveStatus("requesting");

    const normalizedAllowedOrigins = draftAllowedOrigins
      .split("\n")
      .filter(url => !!url)
      .map(origin => normalizeOrigin(origin));

    try {
      await fetch(
        session,
        `https://api.geolonia.com/${REACT_APP_STAGE}/geojsons/${geojsonId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            isPublic,
            name,
            allowedOrigins: normalizedAllowedOrigins,
            status,
            primaryApiKeyId: apiKeyId,
          })
        }
      )
      setSaveStatus("success");
      setGeoJsonMeta({ primaryApiKeyId: apiKeyId, isPublic, name, allowedOrigins: normalizedAllowedOrigins, status, teamId });

    } catch (error) {
      setSaveStatus("failure");
      throw new Error();
    }

  }, [draftAllowedOrigins, saveDisabled, apiKeyId, geojsonId, isPublic, name, session, setGeoJsonMeta, status, teamId])

  const getApiKeyIdAllowedOrigins = (mapKeys: Geolonia.Key[], apiKeyId: string | undefined) => {
    return mapKeys.find(key => key.keyId === apiKeyId)?.allowedOrigins
  }

  const handleSelectApiKey = (event: React.ChangeEvent<{ value: unknown }>) => {

    const savedApiKeyId = event.target.value as string
    const allowedOrigins = getApiKeyIdAllowedOrigins(mapKeys, savedApiKeyId)

    setApiKeyId(savedApiKeyId);
    setApiKeyIdAllowedOrigins(allowedOrigins)
  };

  const embedCode = sprintf(
    '<script type="text/javascript" src="%s/%s/embed?geolonia-api-key=%s"></script>',
    'https://cdn.geolonia.com', // `api.geolonia.com/{stage}/embed` has been deprecated.
    process.env.REACT_APP_STAGE,
    apiKeyId
  );

  return (
    <Grid className="geojson-meta" container spacing={2}>
      <Grid item sm={4} xs={12}>
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
        {draftIsPublic && (
          <Paper className="geojson-title-description">
            <h3>{__("Access allowed URLs")}</h3>
            <p>{__("If you want to add more URLs to the \"URLs to allow access\" set on the API key page, please use the following settings. (e.g., if you want to use multiple API keys for a single tile, etc.)")}</p>
            <h4>{__("URLs from API Key page.")}</h4>
            <TextField
              multiline={true}
              fullWidth={true}
              value={apiKeyIdAllowedOrigins && apiKeyIdAllowedOrigins.join("\n")}
              disabled
              variant="outlined"
            />
            <h4>{__("Enter URLs to be added.")}</h4>
            <TextField
              id="standard-name"
              multiline={true}
              rows={5}
              placeholder="https://example.com"
              fullWidth={true}
              value={draftAllowedOrigins}
              onChange={e => setDraftAllowedOrigins(e.target.value)}
              disabled={saveStatus === "requesting"}
              variant="outlined"
            />
            <Save
              onClick={onUpdateClick}
              onError={onRequestError}
              disabled={saveDisabled}
            />
          </Paper>
        )}
      </Grid>
      <Grid item sm={8} xs={12}>
        <Paper style={sidebarStyle}>
          <Typography component="h2" className="module-title">
            {__("Add the map to your site")}
          </Typography>
          <Typography component="h3" style={styleH3}>
            {__("Step 1")}
          </Typography>
          <p>{__("Please select API key.")}</p>
          <FormControl>
            <InputLabel id="api-key-select-label">API Key</InputLabel>
            <Select
              labelId="api-key-select-label"
              id="api-key-select"
              value={apiKeyId}
              onChange={handleSelectApiKey}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {mapKeys.map((key) => <MenuItem key={key.keyId} value={key.keyId}>{key.name}</MenuItem>)}
            </Select>
          <FormHelperText>
              <Interweave
                content={__("If you don't have one, create it from <a href='#/api-keys'>API Keys</a>.")}
              />
          </FormHelperText>
        </FormControl>
          <Typography component="h3" style={styleH3}>
            {__("Step 2")}
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
            {__("Step 3")}
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
              data-lat="38.592126509927425"
              data-lng="136.8448477633185"
              data-zoom="4"
              data-simple-vector={`${REACT_APP_TILE_SERVER}/customtiles/${geojsonId}/tiles.json?key=${apiKeyId}`}
            >
              {__("Get HTML")}
            </Button>
          </p>
          <Typography component="h3" style={styleH3}>
            {__("Step 4")}
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
      </Grid>
    </Grid>
  );
};

export const mapStateToProps = (state: Geolonia.Redux.AppState): StateProps => {
  const { session } = state.authSupport;
  const { data: teams, selectedIndex } = state.team;
  const teamId = teams[selectedIndex] && teams[selectedIndex].teamId;
  const { data: mapKeys = [] } = state.mapKey[teamId] || {};
  return { session, mapKeys };
};

export default connect(mapStateToProps)(GeoJSONMeta);
