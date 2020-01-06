import React from "react";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";

import { sprintf, __ } from "@wordpress/i18n";
import Interweave from "interweave";

import Code from "../custom/Code";
import Save from "../custom/Save";
import Delete from "../custom/Delete";
import Help from "../custom/Help";
import Title from "../custom/Title";

// types
import { AppState, Session, Key } from "../../types";

// api
import updateKey from "../../api/keys/update";
import deleteKey from "../../api/keys/delete";

// redux
import Redux from "redux";
import { connect } from "react-redux";
import { createActions as createMapKeyActions } from "../../redux/actions/map-key";

// constants
import { messageDisplayDuration } from "../../constants";

type OwnProps = {
  match: { params: { id: string } };
  history: { push: (path: string) => void };
};
type StateProps = {
  mapKey?: Key;
  teamId: string;
  session: Session;
  selectedTeamIndex: number;
};
type DispatchProps = {
  updateKey: (teamId: string, userKey: string, key: Partial<Key>) => void;
  deleteKey: (teamId: string, userKey: string) => void;
};
type Props = OwnProps & StateProps & DispatchProps;

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
      props.history.push("/maps/api-keys");
    }
  }, [prevIndex, props.history, props.selectedTeamIndex]);

  // props
  const propName = (props.mapKey || { name: "" }).name;
  const propOrigins = (props.mapKey || { allowedOrigins: [] }).allowedOrigins;

  // effects
  React.useEffect(() => {
    setName(propName);
    setAllowedOrigins(propOrigins.join("\n"));
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
  const embedHtml =
    '<div\n  class="geolonia"\n  data-lat="35.65810422222222"\n  data-lng="139.74135747222223"\n  data-zoom="9"\n  data-gesture-handling="off"\n  data-geolocate-control="on"\n></div>';
  const embedCode = sprintf(
    '<script type="text/javascript" src="%s/%s/embed?geolonia-api-key=%s"></script>',
    process.env.REACT_APP_API_BASE,
    process.env.REACT_APP_STAGE,
    apiKey
  );
  const embedCSS = `.geolonia {
  width: 500px;
  height: 400px;
}`;

  const breadcrumbItems = [
    {
      title: __("Home"),
      href: "#/"
    },
    {
      title: __("Maps"),
      href: null
    },
    {
      title: __("API keys"),
      href: "#/maps/api-keys"
    },
    {
      title: __("API key settings"),
      href: null
    }
  ];

  const styleDangerZone: React.CSSProperties = {
    border: "1px solid #ff0000",
    marginTop: "10em",
    padding: "16px 24px"
  };

  const styleH3: React.CSSProperties = {
    marginTop: "1em"
  };

  const sidebarStyle: React.CSSProperties = {
    marginBottom: "2em"
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
      .filter(url => !!url);

    const nextKey = {
      name,
      allowedOrigins: normalizedAllowedOrigins
    };

    return updateKey(props.session, props.teamId, apiKey, nextKey).then(
      result => {
        if (result.error) {
          setStatus("failure");
          setMessage(result.message);
          throw new Error(result.code);
        } else {
          setStatus("success");
          props.updateKey(props.teamId, apiKey, nextKey);
        }
      }
    );
  };

  const onRequestError = () => setStatus("failure");

  const onDeleteClick = () => {
    setStatus("requesting");
    return deleteKey(props.session, props.teamId, apiKey).then(result => {
      if (result.error) {
        setStatus("failure");
        setMessage(result.message);
        throw new Error(result.code);
      } else {
        setStatus("success");
        setTimeout(() => {
          props.history.push("/maps/api-keys");
          props.deleteKey(props.teamId, apiKey);
        }, messageDisplayDuration);
      }
    });
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
            <Interweave
              content={__(
                "Each URLs will be used as a value of <code>Access-Control-Allow-Origin</code> header for CORS. Please enter a URL on a new line."
              )}
            ></Interweave>
          </Help>

          <Save
            onClick={onUpdateClick}
            onError={onRequestError}
            disabled={saveDisabled}
          />

          <div style={styleDangerZone}>
            <Typography component="h3" color="secondary">
              {__("Danger Zone")}
            </Typography>
            <p>
              {__(
                "Once you delete an API, there is no going back. Please be certain."
              )}
            </p>
            <Delete
              text1={__("Are you sure you want to delete this API key?")}
              text2={__("Please type in the name of the API key to confirm.")}
              errorMessage={message}
              onClick={onDeleteClick}
              onFailure={onRequestError}
              // disable buttons before page move on success
              disableCancel={status => status === "success"}
              disableDelete={(input, status) =>
                input !== name || status === "success"
              }
            />
          </div>
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
            <Code>{embedCode}</Code>
            <Typography component="h3" style={styleH3}>
              {__("Step 2")}
            </Typography>
            <p>
              {__("Add the following code where you want to place the map.")}
            </p>
            <Code>{embedHtml}</Code>
            <Typography component="h3" style={styleH3}>
              {__("Step 3")}
            </Typography>
            <p>{__("Adjust the element size.")}</p>
            <Code>{embedCSS}</Code>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

const mapStateToProps = (state: AppState, ownProps: OwnProps): StateProps => {
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
    mapKey => mapKey.userKey === ownProps.match.params.id
  );
  return {
    session,
    mapKey,
    teamId,
    selectedTeamIndex
  };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch) => ({
  updateKey: (teamId: string, userKey: string, key: Partial<Key>) =>
    dispatch(createMapKeyActions.update(teamId, userKey, key)),
  deleteKey: (teamId: string, userKey: string) =>
    dispatch(createMapKeyActions.delete(teamId, userKey))
});

export default connect(mapStateToProps, mapDispatchToProps)(Content);
