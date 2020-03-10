import Moment from "moment";
import { HashBy } from "../../types/";

export type Geosearch = {
  geojsonId: string;
  data: GeoJSON.FeatureCollection;
  createAt: Moment.Moment | void;
  updateAt: Moment.Moment | void;
  isPublic: boolean;
  name: string;
};

export type State = {
  [teamId: string]: HashBy<Geosearch, "geojsonId">;
};

const initialState: State = {};

const PUT_GEOSEARCH_ACTION = "PUT_GEOSEARCH_ACTION";

type PutGeosearchAction = {
  type: typeof PUT_GEOSEARCH_ACTION;
  payload: {
    teamId: string;
    geojsonId: string;
    name: string;
    createAt: Moment.Moment | void;
    updateAt: Moment.Moment | void;
    isPublic: boolean;
    geojson: GeoJSON.FeatureCollection;
  };
};

export type GeosearchActions = PutGeosearchAction;

export const createActions = {
  set: (
    teamId: string,
    geojsonId: string,
    name: string,
    createAt: Moment.Moment | void,
    updateAt: Moment.Moment | void,
    isPublic: boolean,
    geojson: GeoJSON.FeatureCollection
  ): PutGeosearchAction => ({
    type: PUT_GEOSEARCH_ACTION,
    payload: {
      geojsonId,
      teamId,
      name,
      createAt,
      updateAt,
      isPublic,
      geojson
    }
  })
};

const isPutGeosearchAction = (
  action: GeosearchActions
): action is PutGeosearchAction => action.type === PUT_GEOSEARCH_ACTION;

export const reducer = (
  state: State = initialState,
  action: GeosearchActions
): State => {
  if (isPutGeosearchAction(action)) {
    const {
      teamId,
      geojsonId,
      name,
      createAt,
      updateAt,
      isPublic,
      geojson
    } = action.payload;
    const prevGeojsonMap = state[teamId] ? state[teamId] : {};
    const prevGeojson = prevGeojsonMap[geojsonId] || {};

    return {
      ...state,
      [teamId]: {
        ...state[teamId],
        ...prevGeojsonMap,
        [geojsonId]: {
          ...prevGeojson,
          data: geojson,
          name,
          createAt,
          updateAt,
          isPublic
        }
      }
    };
  } else {
    return state;
  }
};
