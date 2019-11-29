import Moment from "moment";

export type State = {
  [teamId: string]: {
    featureCollections: {
      [id: string]: {
        data: GeoJSON.FeatureCollection;
        createAt: Moment.Moment | void;
        updateAt: Moment.Moment | void;
        isPublic: boolean;
      };
    };
  };
};

const initialState: State = {};

const PUT_FEATURE_COLLECTION = "SET_FEATURE_COLLECTION";

type PutFeatureCollectionAction = {
  type: typeof PUT_FEATURE_COLLECTION;
  payload: {
    teamId: string;
    featureCollectionId: string;
    featureCollection: GeoJSON.FeatureCollection;
    createAt: Moment.Moment | void;
    updateAt: Moment.Moment | void;
    isPublic: boolean;
  };
};

export type GeosearchActions = PutFeatureCollectionAction;

export const createActions = {
  setFeatureCollections: (
    teamId: string,
    featureCollectionId: string,
    featureCollection: GeoJSON.FeatureCollection,
    createAt: Moment.Moment | void,
    updateAt: Moment.Moment | void,
    isPublic: boolean
  ): PutFeatureCollectionAction => ({
    type: PUT_FEATURE_COLLECTION,
    payload: {
      teamId,
      featureCollectionId,
      featureCollection,
      createAt,
      updateAt,
      isPublic
    }
  })
};

const isPutFeatureCollectionAction = (
  action: GeosearchActions
): action is PutFeatureCollectionAction =>
  action.type === PUT_FEATURE_COLLECTION;

export const reducer = (
  state: State = initialState,
  action: GeosearchActions
): State => {
  if (isPutFeatureCollectionAction(action)) {
    const {
      teamId,
      featureCollectionId,
      featureCollection,
      createAt,
      updateAt,
      isPublic
    } = action.payload;
    const prevFeatureCollections = state[teamId]
      ? state[teamId].featureCollections
      : {};
    const prevFeatureCollection =
      prevFeatureCollections[featureCollectionId] || {};

    return {
      ...state,
      [teamId]: {
        ...state[teamId],
        featureCollections: {
          ...prevFeatureCollections,
          [featureCollectionId]: {
            ...prevFeatureCollection,
            data: featureCollection,
            createAt,
            updateAt,
            isPublic
          }
        }
      }
    };
  } else {
    return state;
  }
};
