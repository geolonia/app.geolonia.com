import React from "react";
import * as clipboard from "clipboard-polyfill";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

import { sprintf, __ } from "@wordpress/i18n";
import Interweave from "interweave";

import Code from "../custom/Code";
import Save from "../custom/Save";
import Delete from "../custom/Delete";
import Help from "../custom/Help";
import Title from "../custom/Title";
import DangerZone from "../custom/danger-zone";

// types
import { AppState, Session, Key } from "../../types";

// api
import updateKey from "../../api/keys/update";
import deleteKey from "../../api/keys/delete";

// redux
import Redux from "redux";
import { connect } from "react-redux";
import { createActions as createMapKeyActions } from "../../redux/actions/map-key";

// libs
import normalizeOrigin from "../../lib/normalize-origin";

// constants
import { messageDisplayDuration } from "../../constants";

type OwnProps = {};
type StateProps = {
  mapKey?: Key;
  teamId: string;
  session: Session;
  selectedTeamIndex: number;
};
type DispatchProps = {
  updateKey: (teamId: string, keyId: string, key: Partial<Key>) => void;
  deleteKey: (teamId: string, keyId: string) => void;
};
type RouterProps = {
  match: { params: { id: string } };
  history: { push: (path: string) => void };
};
type Props = OwnProps & StateProps & DispatchProps & RouterProps;

const Content = (props: Props) => {
  // state
  const [name, setName] = React.useState("");
  const [allowedOrigins, setAllowedOrigins] = React.useState("");
  const [status, setStatus] = React.useState<
    false | "requesting" | "success" | "failure"
  >(false);
  const [message, setMessage] = React.useState("");
  const [prevIndex] = React.useState(props.selectedTeamIndex);

  // move on team change
  React.useEffect(() => {
    if (prevIndex !== props.selectedTeamIndex) {
      props.history.push("/api-keys");
    }
  }, [prevIndex, props.history, props.selectedTeamIndex]);

  // props
  const propName = (props.mapKey || { name: "" }).name;
  const propOrigins = (props.mapKey || { allowedOrigins: [] }).allowedOrigins;

  // effects
  React.useEffect(() => {
    setName(propName);
    setAllowedOrigins(propOrigins.join("\n"));

    const script = document.createElement("script");
    script.src = "https://geolonia.github.io/get-geolonia/app.js";
    document.body.appendChild(script);
  }, [propName, propOrigins]);

  if (!props.mapKey) {
    // no key found
    return null;
  }

  const onNameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const name = e.currentTarget.value;
    setName(name.trim());
  };

  const apiKey = props.mapKey.userKey;
  const embedCode = sprintf(
    '<script type="text/javascript" src="%s/%s/embed?geolonia-api-key=%s"></script>',
    process.env.REACT_APP_API_BASE,
    process.env.REACT_APP_STAGE,
    apiKey
  );
  const embedCSS = `.geolonia {
  width: 100%;
  height: 400px;
}`;

  const { keyId } = props.mapKey;

  const breadcrumbItems = [
    {
      title: __("Home"),
      href: "#/"
    },
    {
      title: __("API keys"),
      href: "#/api-keys"
    }
  ];

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

  const saveDisabled =
    name.trim() === "" ||
    (name === propName && allowedOrigins === propOrigins.join("\n"));

  const onUpdateClick = () => {
    if (saveDisabled) {
      return Promise.resolve();
    }

    setStatus("requesting");

    const normalizedAllowedOrigins = allowedOrigins
      .split("\n")
      .filter(url => !!url)
      .map(origin => normalizeOrigin(origin));

    const nextKey = {
      name,
      allowedOrigins: normalizedAllowedOrigins
    };

    return updateKey(props.session, props.teamId, keyId, nextKey).then(
      result => {
        if (result.error) {
          setStatus("failure");
          setMessage(result.message);
          throw new Error(result.code);
        } else {
          setStatus("success");
          props.updateKey(props.teamId, keyId, nextKey);
        }
      }
    );
  };

  const onRequestError = () => setStatus("failure");

  const onDeleteClick = () => {
    setStatus("requesting");
    return deleteKey(props.session, props.teamId, keyId).then(result => {
      if (result.error) {
        setStatus("failure");
        setMessage(result.message);
        throw new Error(result.code);
      } else {
        setStatus("success");
        setTimeout(() => {
          props.history.push("/api-keys");
          props.deleteKey(props.teamId, keyId);
        }, messageDisplayDuration);
      }
    });
  };

  const copyToClipBoard = (cssSelector: string) => {
    const input = document.querySelector(cssSelector) as HTMLInputElement;
    if (input) {
      input.select();
      clipboard.writeText(input.value);
    }
  };

  return (
    <div>
      <Title breadcrumb={breadcrumbItems} title={__("API key settings")}>
        {__(
          "Configure access control for your API key and Get the HTML code for your map."
        )}
      </Title>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <TextField
            id="standard-name"
            label={__("Name")}
            margin="normal"
            fullWidth={true}
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={status === "requesting"}
            onBlur={onNameBlur}
          />

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
            disabled={status === "requesting"}
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

          <DangerZone
            whyDanger={__(
              "Once you delete an API, there is no going back. Please be certain."
            )}
          >
            <Delete
              text1={__("Are you sure you want to delete this API key?")}
              text2={__("Please type delete to confirm.")}
              errorMessage={message}
              onClick={onDeleteClick}
              onFailure={onRequestError}
              // disable buttons before page move on success
              disableCancel={status => status === "success"}
              disableDelete={(input, status) => {
                return input !== "delete" || status === "success";
              }}
            />
          </DangerZone>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper style={sidebarStyle}>
            <Typography component="h2" className="module-title">
              {__("Your API Key")}
            </Typography>
            <Code>{apiKey}</Code>
          </Paper>
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
        </Grid>
      </Grid>
    </div>
  );
};

const mapStateToProps = (
  state: AppState,
  ownProps: OwnProps & RouterProps
): StateProps => {
  const session = state.authSupport.session;
  const selectedTeamIndex = state.team.selectedIndex;
  // TODO: typing enhancement
  const { teamId } = state.team.data[selectedTeamIndex] || {
    teamId: "-- unexpected fallback when no team id found --"
  };
  if (!state.mapKey[teamId]) {
    return { session, teamId, selectedTeamIndex };
  }
  const mapKeyObject = state.mapKey[teamId] || { data: [] };
  const mapKeys = mapKeyObject.data;
  const mapKey = mapKeys.find(
    mapKey => mapKey.keyId === ownProps.match.params.id
  );
  return {
    session,
    mapKey,
    teamId,
    selectedTeamIndex
  };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch) => ({
  updateKey: (teamId: string, keyId: string, key: Partial<Key>) =>
    dispatch(createMapKeyActions.update(teamId, keyId, key)),
  deleteKey: (teamId: string, keyId: string) =>
    dispatch(createMapKeyActions.delete(teamId, keyId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Content);
