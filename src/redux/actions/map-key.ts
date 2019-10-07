const SET = "MAP_KEY/SET";
const MARK_ERROR = "MAP_KEY/MARK_ERROR";

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

type MapKeyAction = SetAction | MarkErrorAction;

export const createActions = {
  set: (teamId: string, keys: Key[]): SetAction => ({
    type: SET,
    payload: { teamId, keys }
  }),
  markError: (teamId: string): MarkErrorAction => ({
    type: MARK_ERROR,
    payload: { teamId }
  })
};

const isSetAction = (action: MapKeyAction): action is SetAction =>
  action.type === SET;

const isMarkErrorAction = (action: MapKeyAction): action is MarkErrorAction =>
  action.type === MARK_ERROR;

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
  } else {
    return state;
  }
};
