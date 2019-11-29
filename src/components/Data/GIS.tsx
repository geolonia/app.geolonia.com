import React from "react";

import Grid from "@material-ui/core/Grid";

import MapContainer from "./map-container";
import TextEditor from "./text-editor";
// import Upload from "./upload";
// import Fields from "./fields";
// import Publish from "./publish";

import { __ } from "@wordpress/i18n";
import Title from "../custom/Title";

import "./GIS.scss";

// types
import { AppState } from "../../types";
import { connect } from "react-redux";

type OwnProps = {};
type StateProps = {
  featureCollection?: GeoJSON.FeatureCollection;
};
type RouterProps = { match: { params: { id: string } } };

type Props = OwnProps & StateProps;

const Content = (props: Props) => {
  // GeoJSON props to state
  const [geoJSON, setGeoJSON] = React.useState<
    GeoJSON.FeatureCollection | undefined
  >(void 0);

  React.useEffect(() => {
    setGeoJSON(props.featureCollection);
  }, [props.featureCollection]);

  const breadcrumbItems = [
    {
      title: "Home",
      href: "#/"
    },
    {
      title: __("GIS services"),
      href: "#/data"
    },
    {
      title: "Geosearch",
      href: "#/data/gis"
    },
    {
      title: __("Dataset settings"),
      href: null
    }
  ];

  return (
    <div className="gis-panel">
      <Title breadcrumb={breadcrumbItems} title={__("Dataset settings")}>
        {__(
          "You can manage and set the dataset, and get the the access point URL of dataset API."
        )}
      </Title>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <MapContainer geoJSON={geoJSON} setGeoJSON={setGeoJSON} />
        </Grid>
        <Grid item xs={12}>
          <TextEditor geoJSON={geoJSON} setGeoJSON={setGeoJSON} />
        </Grid>
      </Grid>
    </div>
  );
};

export const mapStateToProps = (
  state: AppState,
  ownProps: OwnProps & RouterProps
): StateProps => {
  const team = state.team.data[state.team.selectedIndex];
  if (team) {
    const featureCollectionId = ownProps.match.params.id;
    const featureCollections = state.geosearch[team.teamId]
      ? state.geosearch[team.teamId].featureCollections
      : {};

    const featureCollection = featureCollections[featureCollectionId]
      ? featureCollections[featureCollectionId].data
      : void 0;
    return {
      featureCollection
    };
  } else {
    return { featureCollection: void 0 };
  }
};

export default connect(mapStateToProps)(Content);
