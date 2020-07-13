import byCreateAt from "../../lib/by-create-at";

const SET = "MAP_KEY/SET";
const MARK_ERROR = "MAP_KEY/MARK_ERROR";
const ADD = "MAP_KEY/ADD";
const UPDATE = "MAP_KEY/UPDATE";
const DELETE = "MAP_KEY/DELETE";

type State = Geolonia.Redux.State.MapKey;

const initialState = {};

type SetAction = {
  type: typeof SET;
  payload: { teamId: string; keys: Geolonia.Key[] };
};
type MarkErrorAction = {
  type: typeof MARK_ERROR;
  payload: { teamId: string };
};
type AddAction = {
  type: typeof ADD;
  payload: { teamId: string; key: Geolonia.Key };
};
type UpdateAction = {
  type: typeof UPDATE;
  payload: { teamId: string; keyId: string; key: Partial<Geolonia.Key> };
};
type DeleteAction = {
  type: typeof DELETE;
  payload: { teamId: string; keyId: string };
};

type MapKeyAction =
  | SetAction
  | MarkErrorAction
  | AddAction
  | UpdateAction
  | DeleteAction;

export const createActions = {
  set: (teamId: string, keys: Geolonia.Key[]): SetAction => ({
    type: SET,
    payload: { teamId, keys }
  }),
  markError: (teamId: string): MarkErrorAction => ({
    type: MARK_ERROR,
    payload: { teamId }
  }),
  add: (teamId: string, key: Geolonia.Key): AddAction => ({
    type: ADD,
    payload: { teamId, key }
  }),
  update: (
    teamId: string,
    keyId: string,
    key: Partial<Geolonia.Key>
  ): UpdateAction => ({
    type: UPDATE,
    payload: { teamId, keyId, key }
  }),
  delete: (teamId: string, keyId: string): DeleteAction => ({
    type: DELETE,
    payload: { teamId, keyId }
  })
};

const isSetAction = (action: MapKeyAction): action is SetAction =>
  action.type === SET;

const isMarkErrorAction = (action: MapKeyAction): action is MarkErrorAction =>
  action.type === MARK_ERROR;

const isAddAction = (action: MapKeyAction): action is AddAction =>
  action.type === ADD;

const isUpdateAction = (action: MapKeyAction): action is UpdateAction =>
  action.type === UPDATE;

const isDeleteAction = (action: MapKeyAction): action is DeleteAction =>
  action.type === DELETE;

export const reducer = (state: State = initialState, action: MapKeyAction) => {
  if (isSetAction(action)) {
    const keys = [...action.payload.keys];
    keys.sort(byCreateAt);
    return {
      ...state,
      [action.payload.teamId]: {
        ...state[action.payload.teamId],
        data: keys
      }
    };
  } else if (isMarkErrorAction(action)) {
    return {
      ...state,
      [action.payload.teamId]: {
        ...state[action.payload.teamId],
        error: true
      }
    };
  } else if (isAddAction(action)) {
    const { teamId, key } = action.payload;
    const mapKeyObject = state[teamId] || { data: [] };
    const keys = [...mapKeyObject.data, key];
    keys.sort(byCreateAt);
    return {
      ...state,
      [teamId]: {
        ...mapKeyObject,
        data: keys
      }
    };
  } else if (isUpdateAction(action)) {
    const { teamId, keyId } = action.payload;
    const mapKeyObject = state[teamId] || { data: [] };
    const nextKeyIndex = mapKeyObject.data.map(key => key.keyId).indexOf(keyId);
    const nextKeys = [...mapKeyObject.data];
    nextKeys[nextKeyIndex] = {
      ...nextKeys[nextKeyIndex],
      ...action.payload.key
    };

    return {
      ...state,
      [teamId]: {
        ...state[teamId],
        data: nextKeys
      }
    };
  } else if (isDeleteAction(action)) {
    const { teamId, keyId } = action.payload;
    const mapKeyObject = state[teamId] || { data: [] };
    const nextKeyIndex = mapKeyObject.data.map(key => key.keyId).indexOf(keyId);
    const nextKeys = [...mapKeyObject.data];
    nextKeys.splice(nextKeyIndex, 1);

    return {
      ...state,
      [teamId]: {
        ...state[teamId],
        data: nextKeys
      }
    };
  } else {
    return state;
  }
};
