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
  geojson?: GeoJSON.FeatureCollection;
};
type RouterProps = { match: { params: { id: string } } };

type Props = OwnProps & StateProps;

const Content = (props: Props) => {
  // GeoJSON props to state
  const [geoJSON, setGeoJSON] = React.useState<
    GeoJSON.FeatureCollection | undefined
  >(void 0);

  React.useEffect(() => {
    setGeoJSON(props.geojson);
  }, [props.geojson]);

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
    const geojsonId = ownProps.match.params.id;
    const geosearchMap = state.geosearch[team.teamId] || {};
    const geosearch = geosearchMap[geojsonId];
    return { geojson: geosearch ? geosearch.data : void 0 };
  } else {
    return { geojson: void 0 };
  }
};

export default connect(mapStateToProps)(Content);
