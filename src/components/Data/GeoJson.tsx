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

const Content = (props: Props) => {
  const [message] = useState("");
  const [style, setStyle] = useState<string>("geolonia/basic");
  const [tileStatus, setTileStatus] = useState<TileStatus>(null);

  // custom hooks
  const {
    geoJsonMeta,
    bounds,
    setGeoJsonMeta,
    error
  } = useGeoJSON(props.session, props.geojsonId);

  const {
    session,
    teamId,
    geojsonId,
  } = props;

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

  const onDeleteClick = () => {
    const { session, teamId, geojsonId } = props;
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
          () => props.history.push("/data/geojson"),
          messageDisplayDuration
        );
      });
  };

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

  if (error) {
    return <></>;
  }

  let mapEditorElement: JSX.Element = <></>;
  if (tileStatus === null || tileStatus === "progress") {
    mapEditorElement = <div
      style={{
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column"
    }}
    >
      { tileStatus === "progress" &&  <p>{__("Adding your data to the map...")}</p> }
      <CircularProgress />
    </div>;
  } else if (tileStatus === undefined) {
    mapEditorElement = <ImportDropZone
      session={props.session}
      teamId={props.teamId}
      geojsonId={props.geojsonId}
      isPaidTeam={props.isPaidTeam}
      getTileStatus={getTileStatus}
      setTileStatus={setTileStatus}
    />
  } else if (tileStatus === "created") {
    mapEditorElement = <>
      <MapEditor
        session={props.session}
        style={style}
        geojsonId={props.geojsonId}
        bounds={bounds}
      />
    </>;
  } else if (tileStatus === "failure") {
    mapEditorElement = <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column"
      }}
    >
      <p>{__("Failed to add your data. Your GeoJSON might be invalid format.")}</p>
    </div>;
  }

  return (
    <div className="gis-panel">
      <Title
        breadcrumb={breadcrumbItems}
        title={geoJsonMeta ? geoJsonMeta.name : ""}
      >
        {__(
          "You can manage and style features in your GeoJSON, and get the the access point URL of GeoJSON API."
        )}
      </Title>

      {tileStatus === "created" && (
        <div className="nav">
          <StyleSelector style={style} setStyle={setStyle} />
          {/* <ExportButton GeoJsonID={props.geojsonId} drawObject={drawObject} /> */}
          <ImportDropZoneButton
            session={props.session}
            teamId={props.teamId}
            geojsonId={props.geojsonId}
            isPaidTeam={props.isPaidTeam}
            getTileStatus={getTileStatus}
            setTileStatus={setTileStatus}
          />
        </div>
      )}

      <div className="editor">
        {mapEditorElement}
      </div>

      {props.geojsonId && geoJsonMeta ? (
        <div className="geojson-meta">
          <GeoJsonMeta
            geojsonId={props.geojsonId}
            name={geoJsonMeta.name}
            isPublic={geoJsonMeta.isPublic}
            allowedOrigins={geoJsonMeta.allowedOrigins}
            status={geoJsonMeta.status}
            setGeoJsonMeta={setGeoJsonMeta}
            style={style}
            isPaidTeam={props.isPaidTeam}
          />
        </div>
      ) : (
        <></>
      )}

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

export default connect(mapStateToProps)(Content);
