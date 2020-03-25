import React from "react";

import Grid from "@material-ui/core/Grid";

import MapContainer from "./map-container";
import Delete from "../custom/Delete";
import DangerZone from "../custom/danger-zone";

// @ts-ignore
import MapboxDraw from "@mapbox/mapbox-gl-draw";

// import Upload from "./upload";
// import Fields from "./fields";
// import Publish from "./publish";

import { __ } from "@wordpress/i18n";
import Title from "../custom/Title";
import PropsTable from './PropsTable'
import SimpleStyle from './SimpleStyle'

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

const style: React.CSSProperties = {
  backgroundColor: "#EEEEEE",
  padding: "16px",
  textAlign: "center",
  color: "#555555",
  fontWeight: "bold",
}

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

  React.useEffect(() => {
    props.geosearch && setGeoJSON(props.geosearch.data);
  }, [props.geosearch]);

  const breadcrumbItems = [
    {
      title: __("Home"),
      href: "#/"
    },
    {
      title: __("GIS services"),
      href: null
    },
    {
      title: __("Geosearch"),
      href: "#/data/gis"
    },
    {
      title: __("Dataset settings"),
      href: null
    }
  ];

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

  const updateFeatureProps = (key: keyof FeatureProperties, value: string | number) => {
    if (currentFeature) {
      const feature = {...currentFeature} as Feature
      feature.properties[key] = value
      setCurrentFeature(feature)
      drawObject.setFeatureProperty(currentFeature.id, key, value)
    }
  }

  const onClickFeatureHandler = (feature: Feature | undefined) => {
    mergeDefaultProperties(feature)
    setCurrentFeature(feature)
  }

  const drawCallback = (drawObject: MapboxDraw) => {
    setDrawObject(drawObject)
  }

  const deleteFeatureCallback = (feature: Feature) => {
    setCurrentFeature(undefined)
  }

  const onRequestError = () => setStatus("failure");

  return (
    <div className="gis-panel">
      <Title breadcrumb={breadcrumbItems} title={__("Dataset settings")}>
        {__(
          "You can manage and set the dataset, and get the the access point URL of dataset API."
        )}
      </Title>

      <div className="editor">
        <MapContainer drawCallback={drawCallback} geoJSON={geoJSON} mapHeight="500px" onClickFeature={onClickFeatureHandler} deleteCallback={deleteFeatureCallback} />
          {currentFeature? <PropsTable currentFeature={currentFeature} updateFeatureProperties={updateFeatureProps} />:<></>}
      </div>

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
