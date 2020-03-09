import React, { Dispatch } from "react";

// components
import Table from "../custom/Table";
import AddNew from "../custom/AddNew";
import Title from "../custom/Title";

// utils
import { __ } from "@wordpress/i18n";
import { connect } from "react-redux";
import dateParse from "../../lib/date-parse";

// types
import {
  AppState,
  FeatureCollection,
  Session,
  DateStringify
} from "../../types";
import Redux from "redux";

// api
import createGeosearch from "../../api/geosearch/create";

// redux
import {
  createActions as createGeosearchActions,
  GeoJSONData
} from "../../redux/actions/geosearch";

type Row = {
  id: number | string;
  name: string;
  updated: string;
  isPublic: boolean;
};

type OwnProps = {};
type StateProps = {
  session: Session;
  teamId?: string;
  featureCollections: {
    [id: string]: Omit<FeatureCollection, "id">;
  };
};
type DispatchProps = {
  addGeoJSON: (teamId: string, data: GeoJSONData) => void;
};
type Props = OwnProps & StateProps & DispatchProps;

function Content(props: Props) {
  const [message, setMessage] = React.useState("");

  const rows: Row[] = Object.keys(props.featureCollections).map((id, index) => {
    const { createAt, isPublic } = props.featureCollections[id];
    return {
      id,
      name: `フィーチャーコレクション ${index}`, // TODO: this is mock value
      updated: createAt
        ? createAt.format("YYYY/MM/DD hh:mm:ss")
        : __("(No date)"),
      isPublic
    };
  });

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
      href: null
    }
  ];

  const handler = (name: string) => {
    const { teamId } = props;
    if (!teamId) {
      return Promise.resolve();
    }

    return createGeosearch(props.session, teamId, name).then(result => {
      if (result.error) {
        setMessage(result.message);
        throw new Error(result.code);
      } else {
        const data = dateParse<DateStringify<GeoJSONData>>(result.data);
        props.addGeoJSON(teamId, data);
      }
    });
  };

  return (
    <div>
      <Title breadcrumb={breadcrumbItems} title="Geosearch">
        {__(
          "Geosearch is an API service specialized for location data. Register various location information data such as stores and real estate informations that you have."
        )}
      </Title>

      <AddNew
        label={__("Create a new dataset")}
        description={__("Please enter the name of the new dataset.")}
        defaultValue={__("My dataset")}
        onClick={handler}
        onError={() => {
          /*TODO: show messages*/
        }}
        errorMessage={message}
      />

      <Table rows={rows} rowsPerPage={10} permalink="/data/gis/%s" />
    </div>
  );
}

export const mapStateToProps = (state: AppState): StateProps => {
  const team = state.team.data[state.team.selectedIndex];
  const { session } = state.authSupport;
  if (team) {
    return {
      session,
      teamId: team.teamId,
      featureCollections: state.geosearch[team.teamId]
        ? state.geosearch[team.teamId].featureCollections
        : {}
    };
  } else {
    return { session, featureCollections: {} };
  }
};

export const mapDispatchToProps = (dispatch: Redux.Dispatch): DispatchProps => {
  return {
    // TODO: fix any
    addGeoJSON: (teamId: string, _data: any) => {
      const { geojsonId, createAt, updateAt, data, isPublic } = _data;
      dispatch(
        createGeosearchActions.setGeoJSON(
          teamId,
          geojsonId,
          data,
          createAt,
          updateAt,
          isPublic
        )
      );
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Content);
