import React from "react";

// components
import AsyncTable from "../custom/AsyncTable";
import AddNew from "../custom/AddNew";
import Title from "../custom/Title";
import { CircularProgress } from "@material-ui/core";

// utils
import { __ } from "@wordpress/i18n";
import { connect } from "react-redux";
import Moment from "moment";
import queryString from "query-string";
import fetch from "../../lib/fetch";

const { REACT_APP_STAGE } = process.env;

type Row = {
  id: number | string;
  name: string;
  updated: string;
  isPublic: boolean;
};

type OwnProps = {};
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
  const [message, setMessage] = React.useState("");
  const [geoJsons, setGeoJsons] = React.useState<typeTableRows[]>([]);
  // watchDog monitors successful POST request and force refresh.
  const [watchdog, setWatchdog] = React.useState(0);
  const [perPage, setPerPage] = React.useState(10);
  const [totalCount, setTotalCount] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  const page = Number(queryString.parse(props.location.search).page) || 0;
  React.useEffect(() => {
    if (props.teamId && props.session) {
      setLoading(true);
      fetch(
        props.session,
        `https://api.geolonia.com/${REACT_APP_STAGE}/geojsons?teamId=${props.teamId}&per_page=${perPage}&page=${page}`
      )
        .then(res => {
          if (res.status < 300) {
            return res.json();
          } else {
            throw new Error();
          }
        })
        .then(json => {
          const { totalCount, geojsons } = json;

          if (perPage * page > totalCount) {
            props.history.push("?page=0");
            return;
          }

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
          setTotalCount(totalCount);
          setGeoJsons(
            rows.sort((a: typeTableRows, b: typeTableRows) => {
              if (a.updated > b.updated) {
                return -1;
              } else {
                return 1;
              }
            })
          );
        })
        .catch(err => {
          console.error(err);
          alert(__("Network Error."));
        })
        .finally(() => setLoading(false));
    }
  }, [
    props.teamId,
    props.session,
    watchdog,
    props.location.search,
    page,
    perPage,
    props.history
  ]);

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

  const handler = (name: string) => {
    const { teamId, session } = props;
    if (!(teamId && session)) {
      return Promise.resolve();
    }

    return fetch(
      props.session,
      `https://api.geolonia.com/${REACT_APP_STAGE}/geojsons?teamId=${teamId}`,
      {
        method: "POST",
        body: JSON.stringify({ name })
      }
    )
      .then(res => {
        if (res.status < 300) {
          return res.json();
        } else {
          throw new Error();
        }
      })
      .then(() => {
        // wait until the Elasticsearch completes indexing
        return new Promise(resolve => {
          setTimeout(() => {
            setWatchdog(watchdog + 1);
            resolve();
          }, 1500);
        });
      })
      .catch(() => {
        setMessage(__("Network error."));
        throw new Error(); // will be caught by <AddNew />
      });
  };

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
        onClick={handler}
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
        <AsyncTable
          page={page}
          rows={geoJsons}
          rowsPerPage={perPage}
          setPerPage={setPerPage}
          totalCount={totalCount}
          permalink="/data/geojson/%s"
          onChangePage={page => props.history.push(`?page=${page}`)}
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
