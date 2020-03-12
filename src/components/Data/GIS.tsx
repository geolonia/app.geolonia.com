import React from "react";

import Grid from "@material-ui/core/Grid";

import MapContainer from "./map-container";
import TextEditor from "./text-editor";
import Save from "../custom/Save";
// import Upload from "./upload";
// import Fields from "./fields";
// import Publish from "./publish";

import { __ } from "@wordpress/i18n";
import Title from "../custom/Title";

import "./GIS.scss";

// types
import { AppState, Session, Geosearch } from "../../types";
import { connect } from "react-redux";

// api
import updateGeosearch from "../../api/geosearch/update";

type OwnProps = {};
type StateProps = {
  session: Session;
  geojsonId?: string;
  teamId?: string;
  geosearch?: Omit<Geosearch, "geojsonId">;
};
type DispatchProps = {
  updateGeosearch: (
    teamId: string,
    geojsonId: string,
    geosearch: {
      name?: string;
      isPublic?: boolean;
      data?: GeoJSON.FeatureCollection;
    }
  ) => void;
};
type RouterProps = { match: { params: { id: string } } };
type Props = OwnProps & RouterProps & StateProps & DispatchProps;

const Content = (props: Props) => {
  // GeoJSON props to state
  const [geoJSON, setGeoJSON] = React.useState<
    GeoJSON.FeatureCollection | undefined
  >(void 0);
  const [status, setStatus] = React.useState<
    false | "requesting" | "success" | "failure"
  >(false);
  const [message, setMessage] = React.useState("");

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
  const onUpdateClick = () => {
    if (!props.teamId || !props.geojsonId || !props.geosearch) {
      return Promise.resolve();
    }
    setStatus("requesting");

    const nextGeosearch = {
      data: geoJSON
    };

    return updateGeosearch(
      props.session,
      props.teamId,
      props.geojsonId,
      nextGeosearch
    ).then(result => {
      if (result.error) {
        setStatus("failure");
        setMessage(result.message);
        throw new Error(result.code);
      } else {
        setStatus("success");
        // TODO: dispatch update geosearch action
        // props.updateGeosearch(props.teamId, geojsonId, nextGeosearch);
      }
    });
  };
  const onRequestError = () => setStatus("failure");

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

      <Save
        onClick={onUpdateClick}
        onError={onRequestError}
        disabled={status === "requesting"}
      />
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

export default connect(mapStateToProps)(Content);
