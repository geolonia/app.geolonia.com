import React, { useCallback, useEffect, useState } from "react";

// components
import AddNew from "../custom/AddNew";
import Title from "../custom/Title";
import { CircularProgress } from "@material-ui/core";

// utils
import { __ } from "@wordpress/i18n";
import { connect } from "react-redux";
import Moment from "moment";
import fetch from "../../lib/fetch";
import { buildApiUrl } from "../../lib/api";
import Table from "../custom/Table";

type OwnProps = Record<string, never>;
type StateProps = {
  session: Geolonia.Session;
  teamId?: string;
};
type RouteProps = {
  location: {
    search: string;
  };
  history: {
    push: (href: string) => void;
  };
};
type Props = OwnProps & StateProps & RouteProps;

type typeTableRows = {
  id: string;
  name: string;
  updated: string;
  isPublic?: boolean | undefined;
};

function Content(props: Props) {
  const [message, setMessage] = useState("");
  const [geoJsons, setGeoJsons] = useState<typeTableRows[]>([]);
  const [loading, setLoading] = useState(false);

  const { teamId, session, history } = props;

  useEffect(() => {
    if (!teamId || !session) {
      return;
    }

    (async () => {
      setLoading(true);
      const rawResp = await fetch(
        session,
        buildApiUrl(`/geojsons?teamId=${teamId}&per_page=10000`)
      );
      if (rawResp.status >= 300) {
        alert(__("Network Error."));
        setLoading(false);
        return;
      }

      const json = await rawResp.json();
      const { geojsons } = json;

      const rows = [];
      for (let i = 0; i < geojsons.length; i++) {
        // const item = dateParse<DateStringify<any>>(json[i]);
        const geojson = geojsons[i];
        rows.push({
          id: geojson.id,
          name: geojson.name,
          updated: Moment(geojson.updateAt).format(),
          isPublic: geojson.isPublic
        } as typeTableRows);
      }
      setGeoJsons(
        rows.sort((a: typeTableRows, b: typeTableRows) => {
          if (a.updated > b.updated) {
            return -1;
          } else {
            return 1;
          }
        })
      );
      setLoading(false);
    })();
  }, [teamId, session, history]);

  const breadcrumbItems = [
    {
      title: __("Home"),
      href: "#/"
    },
    {
      title: __("API services"),
      href: null
    }
  ];

  const createHandler = useCallback(async (name: string) => {
    if (!teamId || !session) {
      return;
    }

    const rawResp = await fetch(
      session,
      buildApiUrl(`/geojsons?teamId=${teamId}`),
      {
        method: "POST",
        body: JSON.stringify({ name })
      }
    );
    if (rawResp.status >= 300) {
      setMessage(__("Network error."));
      throw new Error();
    }
    const resp = await rawResp.json();
    const newId = resp.body._id;
    history.push(`/data/geojson/${newId}`);

  }, [session, history, teamId]);

  return (
    <div>
      <Title breadcrumb={breadcrumbItems} title="GeoJSON API">
        {__(
          "GeoJSON API is an API service specialized for location data. Register various location information data such as stores and real estate informations that you have."
        )}
      </Title>

      <AddNew
        label={__("Create a new dataset")}
        description={__("Please enter the name of the new dataset.")}
        defaultValue={__("My dataset")}
        onClick={createHandler}
        errorMessage={message}
      />

      {loading ? (
        <div
          style={{
            width: "100%",
            height: "200px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <Table
          rows={geoJsons}
          rowsPerPage={10}
          permalink="/data/geojson/%s"
        />
      )}
    </div>
  );
}

export const mapStateToProps = (state: Geolonia.Redux.AppState): StateProps => {
  const team = state.team.data[state.team.selectedIndex];
  const { session } = state.authSupport;
  if (team) {
    const { teamId } = team;
    return {
      session,
      teamId
    };
  } else {
    return { session };
  }
};

export default connect(mapStateToProps)(Content);
