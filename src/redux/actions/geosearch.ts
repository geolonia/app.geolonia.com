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
export type ReadableGeosearch = Omit<Geosearch, "geojsonId">;
export type WritableGeosearch = Partial<
  Omit<Geosearch, "geojsonId" | "createAt" | "updateAt">
>;

export type State = {
  [teamId: string]: HashBy<Geosearch, "geojsonId">;
};

const initialState: State = {};

const SET_GEOSEARCH_ACTION = "SET_GEOSEARCH_ACTION";
const UPDATE_GEOSEARCH_ACTION = "UPDATE_GEOSEARCH_ACTION";
const DELETE_GEOSEARCH_ACTION = "DELETE_GEOSEARCH_ACTION";

type SetGeosearchAction = {
  type: typeof SET_GEOSEARCH_ACTION;
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

type UpdateGeosearchAction = {
  type: typeof UPDATE_GEOSEARCH_ACTION;
  payload: {
    teamId: string;
    geojsonId: string;
    geosearch: WritableGeosearch;
  };
};

type DeleteGeosearchAction = {
  type: typeof DELETE_GEOSEARCH_ACTION;
  payload: {
    teamId: string;
    geojsonId: string;
  };
};

export type GeosearchActions =
  | SetGeosearchAction
  | UpdateGeosearchAction
  | DeleteGeosearchAction;

export const createActions = {
  set: (
    teamId: string,
    geojsonId: string,
    name: string,
    createAt: Moment.Moment | void,
    updateAt: Moment.Moment | void,
    isPublic: boolean,
    geojson: GeoJSON.FeatureCollection
  ): SetGeosearchAction => ({
    type: SET_GEOSEARCH_ACTION,
    payload: {
      geojsonId,
      teamId,
      name,
      createAt,
      updateAt,
      isPublic,
      geojson
    }
  }),
  update: (
    teamId: string,
    geojsonId: string,
    geosearch: WritableGeosearch
  ) => ({
    type: UPDATE_GEOSEARCH_ACTION,
    payload: {
      teamId,
      geojsonId,
      geosearch
    }
  }),
  delete: (teamId: string, geojsonId: string) => ({
    type: DELETE_GEOSEARCH_ACTION,
    payload: { teamId, geojsonId }
  })
};

const isSetGeosearchAction = (
  action: GeosearchActions
): action is SetGeosearchAction => action.type === SET_GEOSEARCH_ACTION;

const isUpdateGeosearchAction = (
  action: GeosearchActions
): action is UpdateGeosearchAction => action.type === UPDATE_GEOSEARCH_ACTION;

const isDeleteGeosearchAction = (
  action: GeosearchActions
): action is DeleteGeosearchAction => action.type === DELETE_GEOSEARCH_ACTION;

export const reducer = (
  state: State = initialState,
  action: GeosearchActions
): State => {
  if (isSetGeosearchAction(action)) {
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
  } else if (isUpdateGeosearchAction(action)) {
    const { teamId, geojsonId, geosearch } = action.payload;
    const prevGeojsonMap = state[teamId] ? state[teamId] : {};
    const prevGeojson = prevGeojsonMap[geojsonId] || {};
    return {
      ...state,
      [teamId]: {
        ...state[teamId],
        ...prevGeojsonMap,
        [geojsonId]: {
          ...prevGeojson,
          ...geosearch
        }
      }
    };
  } else if (isDeleteGeosearchAction(action)) {
    const { teamId, geojsonId } = action.payload;
    const prevGeojsonMap = state[teamId] ? state[teamId] : {};
    const nextGeojsonMap = { ...prevGeojsonMap };
    delete nextGeojsonMap[geojsonId];
    const nextState = {
      ...state,
      [teamId]: nextGeojsonMap
    };
    return nextState;
  } else {
    return state;
  }
};
