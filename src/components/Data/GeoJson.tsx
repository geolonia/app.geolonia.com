import React from "react";

import fetch from "../../lib/fetch";

import MapEditor from "./MapEditor";
import Delete from "../custom/Delete";
import DangerZone from "../custom/danger-zone";

// @ts-ignore
import MapboxDraw from "@mapbox/mapbox-gl-draw";
// @ts-ignore
import geojsonMerge from "@mapbox/geojson-merge";

import Title from "../custom/Title";
import PropsEditor from "./PropsEditor";
import SimpleStyle from "./SimpleStyle";
import ImportButton from "./ImportButton";
import ImportDropZoneButton from "./ImportDropZoneButton";
import ImportDropZone from "./ImportDropZone"
// import ExportButton from "./ExportButton";
import GeoJsonMeta from "./GeoJsonMeta";
import StyleSelector from "./StyleSelector";
import Snackbar from "@material-ui/core/Snackbar";
import Button from "@material-ui/core/Button";
import { CircularProgress } from "@material-ui/core";

// lib
import { connect } from "react-redux";
import { __, sprintf } from "@wordpress/i18n";
import blackOrWhite from "../../lib/black-or-white";
// @ts-ignore
import geojsonExtent from "@mapbox/geojson-extent";

// hooks
import useWebSocket from "./GeoJson/hooks/use-web-socket";
import useGeoJSON from "./GeoJson/hooks/use-geojson";

import "./GeoJson.scss";

// constants
import { messageDisplayDuration } from "../../constants";
import { buildApiUrl } from "../../lib/api";
const { REACT_APP_STAGE } = process.env;

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

const Content = (props: Props) => {
  const [message] = React.useState("");
  const [currentFeature, setCurrentFeature] = React.useState<
    Geolonia.Feature | undefined
  >();
  const [drawObject, setDrawObject] = React.useState<MapboxDraw>();
  const [numberFeatures, setNumberFeatures] = React.useState<number>(0);
  const [style, setStyle] = React.useState<string>("geolonia/basic");
  const [tileStatus, setTileStatus] = React.useState< undefined | "progress" | "created" | "failure">(undefined);

  // custom hooks
  const {
    geoJsonMeta,
    bounds,
    geoJSON,
    setGeoJSON,
    setGeoJsonMeta,
    setBounds,
    error
  } = useGeoJSON(props.session, props.geojsonId);

  const [socket, updateRequired, resetUpdateRequired] = useWebSocket(
    props.session,
    props.teamId,
    props.geojsonId
  );

  // send web socket message to notify team members
  const publish = (featureId = "") => {
    if (!socket) {
      return
    }
    socket.send(
      JSON.stringify({
        action: "publish",
        data: {
          geojsonId: props.geojsonId,
          featureId: featureId
        }
      })
    );
  };

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

  /**
   * Merge default properties to the feature to prevent undefined error.
   *
   * @param feature
   */
  const mergeDefaultProperties = (feature: Geolonia.Feature | undefined) => {
    if (!feature) {
      return feature;
    }

    const type = feature.geometry.type;
    const styleSpec = SimpleStyle[type];

    for (const key in styleSpec) {
      if ("undefined" === typeof feature.properties[key]) {
        feature.properties[key] = styleSpec[key].default;
      }
    }

    if ("undefined" === typeof feature.properties.title) {
      feature.properties.title = "";
    }

    if ("undefined" === typeof feature.properties.description) {
      feature.properties.description = "";
    }
  };

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

  /**
   * Update the `currentFeature` and set default properties.
   *
   * @param feature
   */
  const onClickFeatureHandler = (event: any) => {
    setBounds(undefined);

    if (1 < event.features.length || 0 === event.features.length) {
      setCurrentFeature(undefined); // We don't support multiple selection to edit property.
      return;
    }

    // Set the default properties, title, description ..., if the feature doesn't have them.
    mergeDefaultProperties(event.features[0]);
    setCurrentFeature(event.features[0]);
  };

  /**
   * Set the Mapbox GL Draw object into state.
   *
   * @param drawObject
   */
  const drawCallback = (drawObject: MapboxDraw) => {
    setDrawObject(drawObject);
  };

  /**
   * Fires when user will do something change property.
   *
   * @param key
   * @param value
   */
  const updateFeatureProps = (
    key: keyof Geolonia.FeatureProperties,
    value: string | number
  ) => {
    if (currentFeature) {
      const feature = { ...currentFeature } as Geolonia.Feature;
      feature.properties[key] = value;
      drawObject.setFeatureProperty(feature.id, key, value);

      if ("text-color" === key) {
        feature.properties["text-halo-color"] = blackOrWhite(value as string);
        drawObject.setFeatureProperty(
          feature.id,
          "text-halo-color",
          blackOrWhite(value as string)
        );
      }

      setCurrentFeature(feature);
      setGeoJSON(drawObject.getAll()); // It is needed to assign result of edit to the map.

      fetch(
        props.session,
        buildApiUrl(`/geojsons/${props.geojsonId}/features/${feature.id}`),
        {
          method: "PUT",
          body: JSON.stringify(feature)
        }
      ).then(() => publish(feature.id));
    }
  };

  /**
   * Fires when a feature will be created, updated, deleted.
   * @param event
   */
  const saveFeatureCallback = (event: any) => {
    if ("draw.create" === event.type) {
      fetch(
        props.session,
        buildApiUrl(`/geojsons/${props.geojsonId}/features`),
        {
          method: "POST",
          body: JSON.stringify(event.features)
        }
      ).then(() => publish());
    } else if ("draw.update" === event.type) {
      event.features.forEach((feature: GeoJSON.Feature) => {
        return fetch(
          props.session,
          buildApiUrl(`/geojsons/${props.geojsonId}/features/${feature.id}`),
          {
            method: "PUT",
            body: JSON.stringify(feature)
          }
        ).then(() => {
          publish();
        });
      });
    } else if ("draw.delete" === event.type) {
      setCurrentFeature(undefined); // Set undefined to currentFeature
      Promise.all(
        event.features.map((feature: GeoJSON.Feature) => {
          return fetch(
            props.session,
            buildApiUrl(`/geojsons/${props.geojsonId}/features/${feature.id}`),
            {
              method: "PUT",
              body: JSON.stringify({ deleted: true })
            }
          );
        })
      ).then(() => {
        publish();
      });
    }
  };

  const GeoJsonImporter = (geojson: GeoJSON.FeatureCollection) => {
    drawObject.changeMode(drawObject.modes.SIMPLE_SELECT);
    setCurrentFeature(undefined); // Deselect a feature, because it may be deleted.

    for (let i = 0; i < geojson.features.length; i++) {
      if (geojson.features[i].id) {
        // Delete existing feature that has same `id`.
        drawObject.delete(geojson.features[i].id);
      }
    }

    // Get all features that contains existing and imported feature.
    const all = geojsonMerge.merge([drawObject.getAll(), geojson]);

    setGeoJSON(all);
    setBounds(geojsonExtent(all));

    fetch(
      props.session,
      buildApiUrl(`/geojsons/${props.geojsonId}/features`),
      {
        method: "POST",
        body: JSON.stringify(all.features)
      }
    ).then(() => publish());
  };

  const getNumberFeatures = () => {
    if (drawObject) {
      const number = drawObject.getAll().features.length;
      setNumberFeatures(number);
    }
  };

  const sleep = () => {
    return new Promise(resolve => setTimeout(resolve, 1000));
  }

  const getTileStatus = async (session: Geolonia.Session, teamId: string, geojsonId: string ) => {
    let status: undefined | "progress" | "created" | "failure"
    while (status !== "created") {
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
      await sleep()
    }
    return status
  }

  if (error) {
    return <></>;
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
          <StyleSelector style={style} setStyle={setStyle}></StyleSelector>
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

      <Snackbar
        className={"snackbar-update-required"}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        open={updateRequired === true}
        message={__("Update required")}
        action={
          <>
            <Button
              color="secondary"
              size="small"
              onClick={() => {
                fetch(
                  props.session,
                  buildApiUrl(`/geojsons/${props.geojsonId}/features`)
                )
                  .then(res => res.json())
                  .then(json => {
                    const geojson = {
                      type: "FeatureCollection",
                      features: json.features
                    } as GeoJSON.FeatureCollection;
                    setGeoJSON(geojson);
                    setBounds(geojsonExtent(geojson));
                    resetUpdateRequired();
                  });
              }}
            >
              {__("Reload")}
            </Button>
            <Button
              color="secondary"
              size="small"
              onClick={() => {
                resetUpdateRequired();
              }}
            >
              {__("Continue")}
            </Button>
          </>
        }
      ></Snackbar>

      <div className="editor">
        {tileStatus  ? (
          <>
          {tileStatus === "created" ? (
            <>
            <MapEditor
              style={style}
              drawCallback={drawCallback}
              getNumberFeatures={getNumberFeatures}
              geojsonId={props.geojsonId}
              geoJSON={geoJSON}
              onClickFeature={onClickFeatureHandler}
              saveCallback={saveFeatureCallback}
              bounds={bounds}
            />
            {currentFeature ? (
              <PropsEditor
                currentFeature={currentFeature}
                updateFeatureProperties={updateFeatureProps}
              />
            ) : (
              <></>
            )}
          </>
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column"
              }}
            >
              <>
                {tileStatus === "failure" ? (
                  <p>{__("Failed to add your data. Your GeoJSON might be invalid format.")}</p>
                ) : (
                  <>
                    <p>{__("Adding your data to map")}</p>
                    <CircularProgress />
                  </>
                )}
              </>
            </div>
          )}
          </>
        ) : (
          <ImportDropZone
            session={props.session}
            teamId={props.teamId}
            geojsonId={props.geojsonId}
            isPaidTeam={props.isPaidTeam}
            getTileStatus={getTileStatus}
            setTileStatus={setTileStatus}
          />
        )}
      </div>

      <div className="number-features">
        {sprintf(
          __("Total Count of Features: %s"),
          new Intl.NumberFormat().format(numberFeatures)
        )}
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
