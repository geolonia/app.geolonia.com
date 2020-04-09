import React from "react";

import MapEditor from "./MapEditor";
import Delete from "../custom/Delete";
import DangerZone from "../custom/danger-zone";

// @ts-ignore
import MapboxDraw from "@mapbox/mapbox-gl-draw";
// @ts-ignore
import geojsonMerge from '@mapbox/geojson-merge';
// @ts-ignore
import geojsonExtent from '@mapbox/geojson-extent'

import { __, sprintf } from "@wordpress/i18n";
import Title from "../custom/Title";
import PropsEditor from './PropsEditor'
import SimpleStyle from './SimpleStyle'
import ImportButton from './ImportButton'
import ExportButton from './ExportButton'
import GeoJsonMeta from './GeoJsonMeta'
import StyleSelector from './StyleSelector'

import "./GeoJson.scss";

// types
import {
  AppState,
  Session,
  Feature,
  FeatureProperties
} from "../../types";

import { connect } from "react-redux";

// api
// import updateGeosearch from "../../api/geosearch/update";
import deleteGeosearch from "../../api/geosearch/delete";

// constants
import { messageDisplayDuration } from "../../constants";

const { REACT_APP_STAGE } = process.env;

type OwnProps = {};

type StateProps = {
  session: Session;
  geojsonId?: string;
  teamId?: string;
};

type DispatchProps = {
  updateGeosearch: (
    teamId: string,
    geojsonId: string,
  ) => void;
  deleteGeosearch: (teamId: string, geojsonId: string) => void;
};

type RouterProps = {
  match: { params: { id: string } };
  history: { push: (path: string) => void };
  currentFeature: object;
};

type Props = OwnProps & RouterProps & StateProps & DispatchProps;

const blackOrWhite = (hexcolor: string) => {
  if (! hexcolor.startsWith('#')) {
    return '#000000'
  }

	var r = parseInt(hexcolor.substr( 1, 2 ), 16)
	var g = parseInt(hexcolor.substr( 3, 2 ), 16)
	var b = parseInt(hexcolor.substr( 5, 2 ), 16)

	return ( ( ( (r * 299) + (g * 587) + (b * 114) ) / 1000 ) < 128 ) ? "#FFFFFF" : "#000000" ;
}

const Content = (props: Props) => {
  const [geoJSON, setGeoJSON] = React.useState<
    GeoJSON.FeatureCollection | undefined
  >(void 0);
  const [status, setStatus] = React.useState<
    false | "requesting" | "success" | "failure"
  >(false);
  const [message, setMessage] = React.useState("");
  const [currentFeature, setCurrentFeature] = React.useState<Feature | undefined>();
  const [drawObject, setDrawObject] = React.useState<MapboxDraw>();
  const [numberFeatures, setNumberFeatures] = React.useState<number>(0)
  const [bounds, setBounds] = React.useState<mapboxgl.LngLatBoundsLike | undefined>(undefined)
  const [publicGeoJson, setPublicGeoJson] = React.useState<boolean>(true)
  const [geoJsonMeta, setGeoJsonMeta] = React.useState<object | undefined>()
  const [title, setTitle] = React.useState<string>('')
  const [style, setStyle] = React.useState<string>('geolonia/basic')

  React.useEffect(() => {
    if (props.teamId && props.session && props.geojsonId) {
      const idToken = props.session.getIdToken().getJwtToken();

      fetch(
        `https://api.geolonia.com/${REACT_APP_STAGE}/geojsons/${props.geojsonId}`,
        {
          headers: {
            Authorization: idToken
          }
        }
      ).then(res => res.json()).then(json => {
        setGeoJSON(json.data);
        setBounds(geojsonExtent(json.data))
        setGeoJsonMeta(json)
        setTitle(json.name)
      });
    }
  }, [props.teamId, props.session, props.geojsonId]);

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
      title: __("GeoJSON API"),
      href: "#/data/geojson"
    },
  ];

  /**
   * Merge default properties to the feature to prevent undefined error.
   *
   * @param feature
   */
  const mergeDefaultProperties = (feature: Feature | undefined) => {
    if (! feature) {
      return feature
    }

    const type = feature.geometry.type
    const styleSpec = SimpleStyle[type]

    for (const key in styleSpec) {
      if ("undefined" === typeof feature.properties[key]) {
        feature.properties[key] = styleSpec[key].default
      }
    }

    if ("undefined" === typeof feature.properties.title) {
      feature.properties.title = ''
    }

    if ("undefined" === typeof feature.properties.description) {
      feature.properties.description = ''
    }
  }

  const onDeleteClick = () => {
    const { session, teamId, geojsonId } = props;
    if (!teamId || !geojsonId) {
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

  /**
   * Update the `currentFeature` and set default properties.
   *
   * @param feature
   */
  const onClickFeatureHandler = (event: any) => {
    setBounds(undefined)

    if (1 < event.features.length || 0 === event.features.length) {
      setCurrentFeature(undefined) // We don't support multiple selection to edit property.
      return
    }

    // Set the default properties, title, description ..., if the feature doesn't have them.
    mergeDefaultProperties(event.features[0])
    setCurrentFeature(event.features[0])
  }

  /**
   * Set the Mapbox GL Draw object into state.
   *
   * @param drawObject
   */
  const drawCallback = (drawObject: MapboxDraw) => {
    setDrawObject(drawObject)
  }

  /**
   * Fires when user will do something change property.
   *
   * @param key
   * @param value
   */
  const updateFeatureProps = (key: keyof FeatureProperties, value: string | number) => {
    if (currentFeature) {
      const feature = {...currentFeature} as Feature
      feature.properties[key] = value
      drawObject.setFeatureProperty(feature.id, key, value)

      if ('text-color' === key) {
        feature.properties['text-halo-color'] = blackOrWhite(value as string)
        drawObject.setFeatureProperty(feature.id, 'text-halo-color', blackOrWhite(value as string))
      }

      setCurrentFeature(feature)
      setGeoJSON(drawObject.getAll()) // It is needed to assign result of edit to the map.

      console.log(feature)
    }
  }

  /**
   * Fires when a feature will be created, updated, deleted.
   *
   * @param event
   */
  const saveFeatureCallback = (event: any) => {
    if ('draw.delete' === event.type) {
      setCurrentFeature(undefined) // Set undefined to currentFeature
    }

    if ('draw.create' === event.type) {
      // event.features[0] を追加。
    } else if ('draw.update' === event.type) {
      // event.features をループでアップデート
    } else if ('draw.delete' === event.type) {
      // event.features をループで削除
    }

    console.log(event)
  }

  const GeoJsonImporter = (geojson: GeoJSON.FeatureCollection) => {
    setCurrentFeature(undefined) // Deselect a feature, because it may be deleted.

    for (let i = 0; i < geojson.features.length; i++) {
      if (geojson.features[i].id) {
        // Delete existing feature that has same `id`.
        drawObject.delete(geojson.features[i].id)
      }
    }

    // Get all features that contains existing and imported feature.
    const all = geojsonMerge.merge([drawObject.getAll(), geojson]);

    setGeoJSON(all)
    setBounds(geojsonExtent(all))

    // ここで FeatureCollection を保存
    console.log(all)
  }

  const getNumberFeatures = () => {
    if (drawObject) {
      const number = drawObject.getAll().features.length
      setNumberFeatures(number)
    }
  }

  const onRequestError = () => setStatus("failure");

  return (
    <div className="gis-panel">
      <Title breadcrumb={breadcrumbItems} title={title}>
        {__(
          "You can manage and style features in your GeoJSON, and get the the access point URL of GeoJSON API."
        )}
      </Title>

      <div className="nav">
        <StyleSelector style={style} setStyle={setStyle}></StyleSelector>
        <ExportButton GeoJsonID={props.geojsonId} drawObject={drawObject} />
        <ImportButton GeoJsonImporter={GeoJsonImporter} />
      </div>

      <div className="editor">
        <MapEditor style={style} drawCallback={drawCallback} getNumberFeatures={getNumberFeatures} geoJSON={geoJSON}
            onClickFeature={onClickFeatureHandler} saveCallback={saveFeatureCallback} bounds={bounds} />
          {currentFeature? <PropsEditor currentFeature={currentFeature} updateFeatureProperties={updateFeatureProps} />:<></>}
      </div>

      <div className="number-features">{sprintf(__('Total Count of Features: %s'), new Intl.NumberFormat().format(numberFeatures))}</div>

      <div className="geojson-meta"><GeoJsonMeta style={style} isPayedUser={false} geoJsonMeta={geoJsonMeta} GeoJsonID={props.geojsonId} publicGeoJson={publicGeoJson} setPublicGeoJson={setPublicGeoJson} /></div>

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
    // const geosearchMap = state.geosearch[teamId] || {};
    // const geosearch = geosearchMap[geojsonId];
    return {
      session,
      teamId,
      geojsonId
    };
  } else {
    return { session };
  }
};

export default connect(mapStateToProps)(Content);
