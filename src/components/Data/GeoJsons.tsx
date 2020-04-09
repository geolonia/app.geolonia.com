import React from "react";

// components
import Table from "../custom/Table";
import AddNew from "../custom/AddNew";
import Title from "../custom/Title";

// utils
import { __ } from "@wordpress/i18n";
import { connect } from "react-redux";
import Moment from 'moment'

// types
import {
  AppState,
  Session,
} from "../../types";

const { REACT_APP_STAGE } = process.env;

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
};
type Props = OwnProps & StateProps;

type typeTableRows = {
  id: string;
  name: string;
  updated: string;
  isPublic?: boolean | undefined;
};

function Content(props: Props) {
  const [message, setMessage] = React.useState("");
  const [geoJsons, setGeoJsons] = React.useState<typeTableRows[]>([]);
  // watchDog monitors successed POST request and force refresh.
  const [watchdog, setWatchdog] = React.useState<number>(0);

  React.useEffect(() => {
    if (props.teamId && props.session) {
      // TODO: API での認証追加時にコメントアウトする
      // const idToken = props.session.getIdToken().getJwtToken();

      fetch(
        `https://api.geolonia.com/${REACT_APP_STAGE}/geojsons?teamId=${props.teamId}`,
        // {
        //   headers: {
        //     Authorization: idToken
        //   }
        // }
      )
        .then(res => res.json())
        .then(json => {
          const { geojsons } = json
          const rows = [];
          for (let i = 0; i < geojsons.length; i++) {
            // const item = dateParse<DateStringify<any>>(json[i]);
            const geojson = geojsons[i]
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
        });
    }
  }, [props.teamId, props.session, watchdog]);

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

    // TODO: API での認証追加時にコメントアウトする
    // const idToken = props.session.getIdToken().getJwtToken();

    return fetch(
      `https://api.geolonia.com/${REACT_APP_STAGE}/geojsons?teamId=${teamId}`,
      {
        method: 'POST',
        // headers: {
        //   Authorization: idToken
        // },
        body: JSON.stringify({ name })
      }
    )
      .then((res) => {
        if(res.status < 300) {
          return res.json()
        } else {
          throw new Error()
        }
      })
      .then(() => {
        // wait until the Elasticsearch completes indexing
        return new Promise((resolve) => {
          setTimeout(() => {
            setWatchdog(watchdog + 1)
            resolve()
          }, 1500)
        })
      })
      .catch(() => {
        setMessage(__('Network error.'))
        throw new Error() // will be caught by <AddNew />
      })
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

      <Table rows={geoJsons} rowsPerPage={10} permalink="/data/geojson/%s" />
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
    };
  } else {
    return { session };
  }
};

export default connect(mapStateToProps)(Content);
