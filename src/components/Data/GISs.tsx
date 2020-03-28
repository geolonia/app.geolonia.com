import React from "react";

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
  Geosearch,
  Session,
  DateStringify,
  HashBy
} from "../../types";
import Redux from "redux";

// api
import createGeosearch from "../../api/geosearch/create";

// redux
import { createActions as createGeosearchActions } from "../../redux/actions/geosearch";

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
  geosearchMap: HashBy<Geosearch, "geojsonId">;
};
type DispatchProps = {
  setGeosearch: (teamId: string, data: Geosearch) => void;
};
type Props = OwnProps & StateProps & DispatchProps;

function Content(props: Props) {
  const [message, setMessage] = React.useState("");
  const rows: Row[] = Object.keys(props.geosearchMap).map(id => {
    const { createAt, isPublic, name } = props.geosearchMap[id];
    return {
      id,
      name,
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
      title: __("API services"),
      href: null
    },
    {
      title: __("GeoJSON Hosting"),
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
        const data = dateParse<DateStringify<Geosearch>>(result.data);
        props.setGeosearch(teamId, data);
      }
    });
  };

  return (
    <div>
      <Title breadcrumb={breadcrumbItems} title="GeoJSON Hosting">
        {__(
          "GeoJSON Hosting is an API service specialized for location data. Register various location information data such as stores and real estate informations that you have."
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

      <Table rows={rows} rowsPerPage={10} permalink="/data/geojson/%s" />
    </div>
  );
}

export const mapStateToProps = (state: AppState): StateProps => {
  const team = state.team.data[state.team.selectedIndex];
  const { session } = state.authSupport;
  if (team) {
    const { teamId } = team;
    return {
      session,
      teamId,
      geosearchMap: state.geosearch[teamId] || {}
    };
  } else {
    return { session, geosearchMap: {} };
  }
};

export const mapDispatchToProps = (dispatch: Redux.Dispatch): DispatchProps => {
  return {
    setGeosearch: (teamId: string, _data: Geosearch) => {
      const { geojsonId, createAt, updateAt, isPublic, name, data } = _data;
      dispatch(
        createGeosearchActions.set(
          teamId,
          geojsonId,
          name,
          createAt,
          updateAt,
          isPublic,
          data
        )
      );
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Content);
