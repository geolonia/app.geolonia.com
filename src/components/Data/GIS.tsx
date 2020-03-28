import React from "react";

import MapContainer from "./MapEditor";
import Delete from "../custom/Delete";
import DangerZone from "../custom/danger-zone";

// @ts-ignore
import MapboxDraw from "@mapbox/mapbox-gl-draw";
// @ts-ignore
import geojsonMerge from '@mapbox/geojson-merge';
// @ts-ignore
import geojsonExtent from '@mapbox/geojson-extent'

// import Upload from "./upload";
// import Fields from "./fields";
// import Publish from "./publish";

import { __, sprintf } from "@wordpress/i18n";
import Title from "../custom/Title";
import PropsEditor from './PropsEditor'
import SimpleStyle from './SimpleStyle'
import ImportButton from './ImportButton'
import ExportButton from './ExportButton'

import "./GIS.scss";

// types
import {
  AppState,
  Session,
  ReadableGeosearch,
  WritableGeosearch,
  Feature,
  FeatureProperties
} from "../../types";

import { connect } from "react-redux";

// api
// import updateGeosearch from "../../api/geosearch/update";
import deleteGeosearch from "../../api/geosearch/delete";

// constants
import { messageDisplayDuration } from "../../constants";

// redux
import Redux from "redux";
import { createActions as createGeosearchActions } from "../../redux/actions/geosearch";

type OwnProps = {};

type StateProps = {
  session: Session;
  geojsonId?: string;
  teamId?: string;
  geosearch?: ReadableGeosearch;
};

type DispatchProps = {
  updateGeosearch: (
    teamId: string,
    geojsonId: string,
    geosearch: WritableGeosearch
  ) => void;
  deleteGeosearch: (teamId: string, geojsonId: string) => void;
};

type RouterProps = {
  match: { params: { id: string } };
  history: { push: (path: string) => void };
  currentFeature: object;
};

type Props = OwnProps & RouterProps & StateProps & DispatchProps;

const Content = (props: Props) => {
  const [geoJSON, setGeoJSON] = React.useState<
    GeoJSON.FeatureCollection | undefined
  >(void 0);
  const [status, setStatus] = React.useState<
    false | "requesting" | "success" | "failure"
  >(false);
  const [message, setMessage] = React.useState("");
  const [currentFeature, setCurrentFeature] = React.useState<Feature | undefined>();
  const [drawObject, setDrawObject] = React.useState<MapboxDraw>();
  const [numberFeatures, setNumberFeatures] = React.useState<number>(0)
  const [bounds, setBounds] = React.useState<mapboxgl.LngLatBoundsLike | undefined>(undefined)

  React.useEffect(() => {
    if (props.geosearch) {
      setGeoJSON(props.geosearch.data);
      setBounds(geojsonExtent(props.geosearch.data))
    }
  }, [props.geosearch]);

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
      title: __("GeoJSON Hosting"),
      href: "#/data/geojson"
    },
    {
      title: __("GeoJSON Editor"),
      href: null
    }
  ];

  /**
   * Merge default properties to the feature to prevent undefined error.
   *
   * @param feature
   */
  const mergeDefaultProperties = (feature: Feature | undefined) => {
    if (! feature) {
      return feature
    }

    const type = feature.geometry.type
    const styleSpec = SimpleStyle[type]

    for (const key in styleSpec) {
      if ("undefined" === typeof feature.properties[key]) {
        feature.properties[key] = styleSpec[key].default
      }
    }

    if ("undefined" === typeof feature.properties.title) {
      feature.properties.title = ''
    }

    if ("undefined" === typeof feature.properties.description) {
      feature.properties.description = ''
    }
  }

  const onDeleteClick = () => {
    const { session, teamId, geojsonId, geosearch } = props;
    if (!teamId || !geojsonId || !geosearch) {
      return Promise.resolve();
    }
    setStatus("requesting");

    return deleteGeosearch(session, teamId, geojsonId).then(result => {
      if (result.error) {
        setStatus("failure");
        setMessage(result.message);
        throw new Error(result.code);
      } else {
        setStatus("success");
        setTimeout(() => {
          props.history.push("/data/gis");
          props.deleteGeosearch(teamId, geojsonId);
        }, messageDisplayDuration);
      }
    });
  };

  /**
   * Update the `currentFeature` and set default properties.
   *
   * @param feature
   */
  const onClickFeatureHandler = (event: any) => {
    setBounds(undefined)

    if (1 < event.features.length || 0 === event.features.length) {
      setCurrentFeature(undefined) // We don't support multiple selection to edit property.
      return
    }

    mergeDefaultProperties(event.features[0]) // Nothing to do if undefined.
    setCurrentFeature(event.features[0])
  }

  /**
   * Set the Mapbox GL Draw object into state.
   *
   * @param drawObject
   */
  const drawCallback = (drawObject: MapboxDraw) => {
    setDrawObject(drawObject)
  }

  /**
   * Fires when user will do something change property.
   *
   * @param key
   * @param value
   */
  const updateFeatureProps = (key: keyof FeatureProperties, value: string | number) => {
    if (currentFeature) {
      const feature = {...currentFeature} as Feature
      feature.properties[key] = value
      drawObject.setFeatureProperty(feature.id, key, value)

      setCurrentFeature(feature)
      setGeoJSON(drawObject.getAll()) // It is needed to assign result of edit to the map.

      console.log(feature)
    }
  }

  /**
   * Fires when a feature will be created, updated, deleted.
   *
   * @param event
   */
  const saveFeatureCallback = (event: any) => {
    if ('draw.delete' === event.type) {
      setCurrentFeature(undefined) // Set undefined to currentFeature
    }

    console.log(event)
  }

  const GeoJsonImporter = (geojson: GeoJSON.FeatureCollection) => {
    const added = geojsonMerge.merge([drawObject.getAll(), geojson]);
    setGeoJSON(added)
    setBounds(geojsonExtent(added))
  }

  const getNumberFeatures = () => {
    if (drawObject) {
      const number = drawObject.getAll().features.length
      setNumberFeatures(number)
    }
  }

  const onRequestError = () => setStatus("failure");

  return (
    <div className="gis-panel">
      <Title breadcrumb={breadcrumbItems} title={__("GeoJSON Editor")}>
        {__(
          "You can manage and style features in your GeoJSON, and get the the access point URL of GeoJSON API."
        )}
      </Title>

      <div className="nav">
        <ExportButton GeoJsonID={props.geojsonId} drawObject={drawObject} />
        <ImportButton GeoJsonImporter={GeoJsonImporter} />
      </div>

      <div className="editor">
        <MapContainer drawCallback={drawCallback} getNumberFeatures={getNumberFeatures} geoJSON={geoJSON}
            onClickFeature={onClickFeatureHandler} saveCallback={saveFeatureCallback} bounds={bounds} />
          {currentFeature? <PropsEditor currentFeature={currentFeature} updateFeatureProperties={updateFeatureProps} />:<></>}
      </div>

      <div className="number-features">{sprintf(__('Total Count of Features: %s'), new Intl.NumberFormat().format(numberFeatures))}</div>

      <DangerZone
        whyDanger={__(
          "Once you delete an Dataset, there is no going back. Please be certain."
        )}
      >
        <Delete
          text1={__("Are you sure you want to delete this Dataset?")}
          text2={__("Please type in the name of the Dataset to confirm.")}
          errorMessage={message}
          onClick={onDeleteClick}
          onFailure={onRequestError}
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
    const geosearchMap = state.geosearch[teamId] || {};
    const geosearch = geosearchMap[geojsonId];
    return {
      session,
      geosearch,
      teamId,
      geojsonId
    };
  } else {
    return { session };
  }
};

export const mapDispatchToProps = (
  dispatch: Redux.Dispatch
): DispatchProps => ({
  updateGeosearch: (
    teamId: string,
    geojsonId: string,
    geosearch: WritableGeosearch
  ) => dispatch(createGeosearchActions.update(teamId, geojsonId, geosearch)),
  deleteGeosearch: (teamId: string, geojsonId: string) =>
    dispatch(createGeosearchActions.delete(teamId, geojsonId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Content);
