import React from "react";

import Grid from "@material-ui/core/Grid";

import MapContainer from "./map-container";
import TextEditor from "./text-editor";
import Save from "../custom/Save";
import Delete from "../custom/Delete";
import DangerZone from "../custom/danger-zone";
// import Upload from "./upload";
// import Fields from "./fields";
// import Publish from "./publish";

import { __ } from "@wordpress/i18n";
import Title from "../custom/Title";

import "./GIS.scss";

// types
import {
  AppState,
  Session,
  ReadableGeosearch,
  WritableGeosearch
} from "../../types";
import { connect } from "react-redux";

// api
import updateGeosearch from "../../api/geosearch/update";
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
};
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
    const { teamId, geojsonId, geosearch } = props;
    if (!teamId || !geojsonId || !geosearch) {
      return Promise.resolve();
    }
    setStatus("requesting");

    const nextGeosearch = {
      data: geoJSON
    };

    return updateGeosearch(
      props.session,
      teamId,
      geojsonId,
      nextGeosearch
    ).then(result => {
      if (result.error) {
        setStatus("failure");
        setMessage(result.message);
        throw new Error(result.code);
      } else {
        setStatus("success");
        // @ts-ignore
        props.updateGeosearch(teamId, geojsonId, result.data);
      }
    });
  };

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
