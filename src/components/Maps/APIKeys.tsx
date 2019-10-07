import React from "react";

import Table from "../custom/Table";
import AddNew from "../custom/AddNew";
import Title from "../custom/Title";

import { __ } from "@wordpress/i18n";
import { connect } from "react-redux";

// api
import createKey from "../../api/keys/create";

// types
import AmazonCognitoIdentity from "amazon-cognito-identity-js";
import { AppState } from "../../redux/store";
import { Key } from "../../redux/actions/map-key";

type OwnProps = {};
type StateProps = {
  session: AmazonCognitoIdentity.CognitoUserSession | undefined;
  mapKeys: Key[];
  error: boolean;
  teamId: string;
};
type Props = OwnProps & StateProps;

function Content(props: Props) {
  const breadcrumbItems = [
    {
      title: "Home",
      href: "#/"
    },
    {
      title: __("Maps"),
      href: "#/maps"
    },
    {
      title: __("API keys"),
      href: null
    }
  ];

  const handler = (name: string) => {
    // TODO: add key to local State
    return createKey(props.session, props.teamId, name).then(console.log);
  };

  const { mapKeys } = props;
  const rows = mapKeys.map(key => {
    return {
      id: key.userKey,
      name: key.name,
      updated: key.updateAt
    };
  });

  return (
    <div>
      <Title breadcrumb={breadcrumbItems} title={__("API keys")}>
        {__("You need an API key to display map. Get an API key.")}
      </Title>

      <AddNew
        label={__("Create a new API key")}
        description={__("Please enter the name of new API key.")}
        default={__("My API")}
        handler={handler}
      />

      <Table rows={rows} rowsPerPage={10} permalink="/maps/api-keys/%s" />
    </div>
  );
}

const mapStateToProps = (state: AppState): StateProps => {
  const session = state.authSupport.session;
  const { data: teams, selectedIndex } = state.team;
  const teamId = teams[selectedIndex].teamId;
  const { data: mapKeys = [], error = false } = state.mapKey[teamId] || {};

  return { session, mapKeys, error, teamId };
};

export default connect(mapStateToProps)(Content);
