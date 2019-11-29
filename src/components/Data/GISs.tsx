import React from "react";

import { __ } from "@wordpress/i18n";

import Table from "../custom/Table";
import AddNew from "../custom/AddNew";
import Title from "../custom/Title";
import { AppState } from "../../types";
import { connect } from "react-redux";

type Row = {
  id: number | string;
  name: string;
  updated: string;
  isPublic: boolean;
};

type OwnProps = {};
type StateProps = {
  featureCollections: {
    [id: string]: {
      data: GeoJSON.FeatureCollection;
      createAt: Date;
      updateAt: Date;
      isPublic: boolean;
    };
  };
};

type Props = OwnProps & StateProps;

function Content(props: Props) {
  // console.log(props.featureCollections);

  const rows: Row[] = Object.keys(props.featureCollections).map(
    (id, index) => ({
      id,
      name: `フィーチャーコレクション ${index}`,
      updated: props.featureCollections[id].createAt.toISOString(),
      isPublic: props.featureCollections[id].isPublic
    })
  );

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
          "Geolonia GIS is an API service specialized for location data. Register various location information data such as stores and real estate informations that you have."
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
      />

      <Table rows={rows} rowsPerPage={10} permalink="/data/gis/%s" />
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
