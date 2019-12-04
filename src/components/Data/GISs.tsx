import React from "react";

// components
import Table from "../custom/Table";
import AddNew from "../custom/AddNew";
import Title from "../custom/Title";

// utils
import { __ } from "@wordpress/i18n";
import { connect } from "react-redux";

// types
import { AppState, FeatureCollection } from "../../types";
import ComingSoon from "../custom/coming-soon";

type Row = {
  id: number | string;
  name: string;
  updated: string;
  isPublic: boolean;
};

type OwnProps = {};
type StateProps = {
  featureCollections: {
    [id: string]: Omit<FeatureCollection, "id">;
  };
};
type Props = OwnProps & StateProps;

function Content(props: Props) {
  // console.log(props.featureCollections);

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
      title: "Home",
      href: "#/"
    },
    {
      title: __("GIS services"),
      href: "#/data"
    },
    {
      title: "Geosearch",
      href: null
    }
  ];

  const handler = (name: string) => {
    console.log(name);
    return Promise.resolve();
  };

  return (
    <div>
      <Title breadcrumb={breadcrumbItems} title="Geosearch">
        {__(
          "Geosearch is an API service specialized for location data. Register various location information data such as stores and real estate informations that you have."
        )}
      </Title>

      <ComingSoon style={{ padding: "1em" }}>
        <AddNew
          label={__("Create a new dataset")}
          description={__("Please enter the name of the new dataset.")}
          defaultValue={__("My dataset")}
          onClick={handler}
          onError={() => {
            /*TODO: show messages*/
          }}
        />

        <Table rows={rows} rowsPerPage={10} permalink="/data/gis/%s" />
      </ComingSoon>
    </div>
  );
}

export const mapStateToProps = (state: AppState): StateProps => {
  const team = state.team.data[state.team.selectedIndex];
  if (team) {
    return {
      featureCollections: state.geosearch[team.teamId]
        ? state.geosearch[team.teamId].featureCollections
        : {}
    };
  } else {
    return { featureCollections: {} };
  }
};

export default connect(mapStateToProps)(Content);
