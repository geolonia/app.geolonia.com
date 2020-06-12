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
// import ExportButton from "./ExportButton";
import GeoJsonMeta from "./GeoJsonMeta";
import StyleSelector from "./StyleSelector";
import Snackbar from "@material-ui/core/Snackbar";
import Button from "@material-ui/core/Button";

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

// types
import { AppState, Session, Feature, FeatureProperties } from "../../types";

// constants
import { messageDisplayDuration } from "../../constants";
const { REACT_APP_STAGE } = process.env;

type OwnProps = {};

type StateProps = {
  session: Session;
  geojsonId?: string;
  teamId?: string;
  isPaidTeam: boolean;
};

type RouterProps = {
  match: { params: { id: string } };
  history: { push: (path: string) => void };
  currentFeature: object;
};

type Props = OwnProps & RouterProps & StateProps;

const Content = (props: Props) => {
  const [message, setMessage] = React.useState("");
  const [currentFeature, setCurrentFeature] = React.useState<
    Feature | undefined
  >();
  const [drawObject, setDrawObject] = React.useState<MapboxDraw>();
  const [numberFeatures, setNumberFeatures] = React.useState<number>(0);

  const [style, setStyle] = React.useState<string>("geolonia/basic");

  // custom hooks
  const {
    geoJsonMeta,
    bounds,
    geoJSON,
    setGeoJSON,
    setGeoJsonMeta,
    setBounds
  } = useGeoJSON(props.session, props.geojsonId);

  const [socket, updateRequired, resetUpdateRequired] = useWebSocket(
    props.session,
    props.teamId,
    props.geojsonId
  );

  // send web socket message to notify team members
  const publish = (featureId = "") => {
    if (socket) {
      socket.send(
        JSON.stringify({
          action: "publish",
          data: {
            geojsonId: props.geojsonId,
            featureId: featureId
          }
        })
      );
    } else {
      console.error("No socket found.");
    }
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
  const mergeDefaultProperties = (feature: Feature | undefined) => {
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
      `https://api.geolonia.com/${REACT_APP_STAGE}/geojsons/${geojsonId}`,
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
    key: keyof FeatureProperties,
    value: string | number
  ) => {
    if (currentFeature) {
      const feature = { ...currentFeature } as Feature;
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
        `https://api.geolonia.com/${REACT_APP_STAGE}/geojsons/${props.geojsonId}/features/${feature.id}`,
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
        `https://api.geolonia.com/${REACT_APP_STAGE}/geojsons/${props.geojsonId}/features`,
        {
          method: "POST",
          body: JSON.stringify(event.features)
        }
      ).then(() => publish());
    } else if ("draw.update" === event.type) {
      event.features.forEach((feature: GeoJSON.Feature) => {
        return fetch(
          props.session,
          `https://api.geolonia.com/${REACT_APP_STAGE}/geojsons/${props.geojsonId}/features/${feature.id}`,
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
            `https://api.geolonia.com/${REACT_APP_STAGE}/geojsons/${props.geojsonId}/features/${feature.id}`,
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
      `https://api.geolonia.com/${REACT_APP_STAGE}/geojsons/${props.geojsonId}/features`,
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

      <div className="nav">
        <StyleSelector style={style} setStyle={setStyle}></StyleSelector>
        {/* <ExportButton GeoJsonID={props.geojsonId} drawObject={drawObject} /> */}
        <ImportButton GeoJsonImporter={GeoJsonImporter} />
      </div>

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
                  `https://api.geolonia.com/${REACT_APP_STAGE}/geojsons/${props.geojsonId}/features`
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
        <MapEditor
          style={style}
          drawCallback={drawCallback}
          getNumberFeatures={getNumberFeatures}
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
          text2={__("Please type in the name of the Dataset to confirm.")}
          answer={geoJsonMeta ? geoJsonMeta.name : void 0}
          errorMessage={message}
          onClick={onDeleteClick}
          onFailure={() => {}}
        />
      </DangerZone>
    </div>
  );
};

export const mapStateToProps = (
  state: AppState,
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
