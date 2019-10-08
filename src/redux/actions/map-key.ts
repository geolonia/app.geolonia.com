const SET = "MAP_KEY/SET";
const MARK_ERROR = "MAP_KEY/MARK_ERROR";
const ADD = "MAP_KEY/ADD";
const UPDATE = "MAP_KEY/UPDATE";
const DELETE = "MAP_KEY/DELETE";

export type Key = {
  userKey: string;
  name: string;
  description: string;
  enabled: boolean;
  forceDisabled: boolean;
  allowedOrigins: string[];
  updateAt: string;
  createAt: string;
};

export type State = {
  [teamId: string]: {
    data: Key[];
    error?: boolean;
  };
};

const initialState = {};

type SetAction = {
  type: typeof SET;
  payload: { teamId: string; keys: Key[] };
};
type MarkErrorAction = {
  type: typeof MARK_ERROR;
  payload: { teamId: string };
};
type AddAction = {
  type: typeof ADD;
  payload: { teamId: string; key: Key };
};
type UpdateAction = {
  type: typeof UPDATE;
  payload: { teamId: string; mapKey: string; key: Partial<Key> };
};
type DeleteAction = {
  type: typeof DELETE;
  payload: { teamId: string; mapKey: string };
};

type MapKeyAction =
  | SetAction
  | MarkErrorAction
  | AddAction
  | UpdateAction
  | DeleteAction;

export const createActions = {
  set: (teamId: string, keys: Key[]): SetAction => ({
    type: SET,
    payload: { teamId, keys }
  }),
  markError: (teamId: string): MarkErrorAction => ({
    type: MARK_ERROR,
    payload: { teamId }
  }),
  add: (teamId: string, key: Key): AddAction => ({
    type: ADD,
    payload: { teamId, key }
  }),
  update: (
    teamId: string,
    mapKey: string,
    key: Partial<Key>
  ): UpdateAction => ({
    type: UPDATE,
    payload: { teamId, mapKey, key }
  }),
  delete: (teamId: string, mapKey: string): DeleteAction => ({
    type: DELETE,
    payload: { teamId, mapKey }
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
    return {
      ...state,
      [action.payload.teamId]: {
        ...state[action.payload.teamId],
        data: action.payload.keys
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
    return {
      ...state,
      [teamId]: {
        ...mapKeyObject,
        data: [...mapKeyObject.data, key]
      }
    };
  } else if (isUpdateAction(action)) {
    const { teamId, mapKey } = action.payload;
    const mapKeyObject = state[teamId] || { data: [] };
    const nextKeyIndex = mapKeyObject.data
      .map(key => key.userKey)
      .indexOf(mapKey);
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
    const { teamId, mapKey } = action.payload;
    const mapKeyObject = state[teamId] || { data: [] };
    const nextKeyIndex = mapKeyObject.data
      .map(key => key.userKey)
      .indexOf(mapKey);
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
