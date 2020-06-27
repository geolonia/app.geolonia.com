import React from "react";

import Table from "../custom/Table";
import AddNew from "../custom/AddNew";
import Title from "../custom/Title";

import { __ } from "@wordpress/i18n";
import { connect } from "react-redux";

// api
import createKey from "../../api/keys/create";

// redux
import Redux from "redux";
import { createActions as createMapKeyActions } from "../../redux/actions/map-key";
import dateParse from "../../lib/date-parse";

type OwnProps = {};
type StateProps = {
  session: Geolonia.Session;
  mapKeys: Geolonia.Key[];
  error: boolean;
  teamId: string;
};
type DispatchProps = {
  addKey: (teamId: string, key: Geolonia.Key) => void;
};
type Props = OwnProps & StateProps & DispatchProps;

function Content(props: Props) {
  const [message, setMessage] = React.useState("");

  const breadcrumbItems = [
    {
      title: __("Home"),
      href: "#/"
    },
    {
      title: __("API keys"),
      href: null
    }
  ];

  const handler = (name: string) => {
    return createKey(props.session, props.teamId, name).then(result => {
      if (result.error) {
        setMessage(result.message);
        throw new Error(result.code);
      } else {
        const data = dateParse(result.data);
        props.addKey(props.teamId, data);
      }
    });
  };

  const { mapKeys } = props;
  const rows = mapKeys.map(key => {
    return {
      id: key.keyId,
      name: key.name,
      updated: key.createAt
        ? key.createAt.format("YYYY/MM/DD hh:mm:ss")
        : __("(No date)")
    };
  });

  return (
    <div>
      <Title breadcrumb={breadcrumbItems} title={__("API keys")}>
        {mapKeys.length === 0 &&
          __("You need an API key to display map. Get an API key.")}
      </Title>

      <AddNew
        label={__("Create a new API key")}
        description={__("Please enter the name of new API key.")}
        defaultValue={__("My API")}
        onClick={handler}
        onError={() => void 0}
        errorMessage={message}
      />

      <Table rows={rows} rowsPerPage={10} permalink="/api-keys/%s" />
    </div>
  );
}

const mapStateToProps = (state: Geolonia.Redux.AppState): StateProps => {
  const { session } = state.authSupport;
  const { data: teams, selectedIndex } = state.team;
  const teamId = teams[selectedIndex] && teams[selectedIndex].teamId;
  const { data: mapKeys = [], error = false } = state.mapKey[teamId] || {};

  return { session, mapKeys, error, teamId };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch) => {
  return {
    addKey: (teamId: string, key: Geolonia.Key) =>
      dispatch(createMapKeyActions.add(teamId, key))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Content);
