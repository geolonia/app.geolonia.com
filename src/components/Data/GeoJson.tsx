import React, { useCallback, useEffect, useState } from "react";

import fetch from "../../lib/fetch";

import MapEditor from "./MapEditor";
import Delete from "../custom/Delete";
import DangerZone from "../custom/danger-zone";

import Title from "../custom/Title";
import ImportDropZoneButton from "./ImportDropZoneButton";
import ImportDropZone from "./ImportDropZone"
// import ExportButton from "./ExportButton";
import GeoJsonMeta from "./GeoJsonMeta";
import StyleSelector from "./StyleSelector";
import { CircularProgress } from "@material-ui/core";

// lib
import { connect } from "react-redux";
import { __ } from "@wordpress/i18n";

// hooks
import useGeoJSON from "./GeoJson/hooks/use-geojson";

import "./GeoJson.scss";
// constants
import { messageDisplayDuration } from "../../constants";
import { buildApiUrl } from "../../lib/api";

type OwnProps = Record<string, never>;

type StateProps = {
  session: Geolonia.Session;
  geojsonId?: string;
  teamId?: string;
  isPaidTeam: boolean;
};

type RouterProps = {
  match: { params: { id: string } };
  history: { push: (path: string) => void };
};

type Props = OwnProps & RouterProps & StateProps;

export type TileStatus = null | undefined | "progress" | "created" | "failure";

const sleep = (msec: number) => {
  return new Promise(resolve => setTimeout(resolve, msec));
}

const mapEditorStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column"
}

const GeoJson = (props: Props) => {
    const {
    session,
    teamId,
    geojsonId,
    isPaidTeam,
    history,
    } = props;

  const [message] = useState("");
  const [style, setStyle] = useState<string>("geolonia/basic");
  const [tileStatus, setTileStatus] = useState<TileStatus>(null);
  const [prevTeamId] = useState(teamId);

  // custom hooks
  const {
    geoJsonMeta,
    bounds,
    setGeoJsonMeta,
    error
  } = useGeoJSON(props.session, props.geojsonId);

// move on team change
  useEffect(() => {
    if (prevTeamId !== teamId) {
      history.push("/data/geojson");
    }
  }, [prevTeamId, history, teamId]);

  const breadcrumbItems = [
    {
      title: __("Home"),
      href: "#/"
    },
    {
      title: __("API services"),
      href: null
    },
    {
      title: __("GeoJSON API"),
      href: "#/data/geojson"
    }
  ];

  const onDeleteClick = useCallback(async () => {
    if (!teamId || !geojsonId) {
      return Promise.resolve();
    }

    return fetch(
      session,
      buildApiUrl(`/geojsons/${geojsonId}`),
      {
        method: "PUT",
        body: JSON.stringify({ deleted: true })
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
        setTimeout(
          () => history.push("/data/geojson"),
          messageDisplayDuration
        );
      });
  }, [session, teamId, geojsonId, history])

  const getTileStatus = useCallback(async () => {
    let status = "progress"
    while (status !== "created" && status !== "failure") {
      await sleep(2500)
      try {
        const res = await fetch(
          session,
          buildApiUrl(`/geojsons/${geojsonId}?teamId=${teamId}`),
          { method: "GET" }
        )
        const json = await res.json()
        status = json.gvp_status

      } catch (error) {
        throw new Error();
      }
    }
    return status
  }, [session, geojsonId, teamId]);

  useEffect(() => {
    if (geoJsonMeta) {
      setTileStatus(geoJsonMeta.gvp_status)
    }
  }, [geoJsonMeta]);

  // invalid url entered
  if (geoJsonMeta && geoJsonMeta.teamId !== teamId) {
    return null;
  }
  if (error) {
    return null;
  }

  let mapEditorElement: JSX.Element | null = null;
  if (tileStatus === null) {
    mapEditorElement = <div style={mapEditorStyle} />;
  } else if (tileStatus === "progress") {
    mapEditorElement = <div style={mapEditorStyle}>
      <p>{__("Adding your data to the map...")}</p>
      <CircularProgress />
    </div>;
  } else if (tileStatus === undefined || tileStatus === 'failure') {
    mapEditorElement = <ImportDropZone
      session={session}
      teamId={teamId}
      geojsonId={geojsonId}
      isPaidTeam={isPaidTeam}
      tileStatus={tileStatus}
      getTileStatus={getTileStatus}
      setTileStatus={setTileStatus}
    />
  } else if (tileStatus === "created") {
    mapEditorElement = <MapEditor
        session={session}
        style={style}
        geojsonId={geojsonId}
        bounds={bounds}
      />;
  } else if (tileStatus === "failure") {
    mapEditorElement = <div style={mapEditorStyle} />;
  }


  return (
    <div className="gis-panel">
      <Title
        breadcrumb={breadcrumbItems}
        title={geoJsonMeta ? geoJsonMeta.name : ""}
      >
        {__(
          "You can upload your location data. Also you can get embed HTML code to add the map to your web site."
        )}
      </Title>

      {tileStatus === "created" && (
        <div className="nav">
          <StyleSelector style={style} setStyle={setStyle} />
          {/* <ExportButton GeoJsonID={geojsonId} drawObject={drawObject} /> */}
          <ImportDropZoneButton
            session={session}
            teamId={teamId}
            geojsonId={geojsonId}
            isPaidTeam={isPaidTeam}
            getTileStatus={getTileStatus}
            setTileStatus={setTileStatus}
          />
        </div>
      )}

      <div className="editor">
        {mapEditorElement}
      </div>

      {geojsonId && geoJsonMeta && <div className="geojson-meta">
          <GeoJsonMeta
            geojsonId={geojsonId}
            name={geoJsonMeta.name}
            isPublic={geoJsonMeta.isPublic}
            allowedOrigins={geoJsonMeta.allowedOrigins}
            teamId={geoJsonMeta.teamId}
            status={geoJsonMeta.status}
            setGeoJsonMeta={setGeoJsonMeta}
            style={style}
            isPaidTeam={isPaidTeam}
          />
        </div>
      }

      <DangerZone
        whyDanger={__(
          "Once you delete an Dataset, there is no going back. Please be certain."
        )}
      >
        <Delete
          text1={__("Are you sure you want to delete this Dataset?")}
          text2={__("Please type delete to confirm.")}
          answer={geoJsonMeta ? geoJsonMeta.name : void 0}
          errorMessage={message}
          onClick={onDeleteClick}
        />
      </DangerZone>
    </div>
  );
};

export const mapStateToProps = (
  state: Geolonia.Redux.AppState,
  ownProps: OwnProps & RouterProps
): StateProps => {
  const session = state.authSupport.session;
  const team = state.team.data[state.team.selectedIndex];
  if (team) {
    const { teamId } = team;
    const geojsonId = ownProps.match.params.id;
    return {
      session,
      teamId,
      geojsonId,
      isPaidTeam: team.isPaidTeam
    };
  } else {
    return { session, isPaidTeam: false };
  }
};

export default connect(mapStateToProps)(GeoJson);
