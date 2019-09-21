import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";

const SET_CURRENT_USER_ACTION = "AUTH_SUPPORT/SET_CURRENT_USER_ACTION";
const SET_SESSION_ACTION = "AUTH_SUPPORT/SET_SESSION";
const READY_ACTION = "AUTH_SUPPORT/READY";

export type AuthSupportState = {
  currentUser?: string;
  session?: AmazonCognitoIdentity.CognitoUserSession;
  isReady: boolean;
  isVerified: boolean;
};

const initialState: AuthSupportState = {
  currentUser: void 0,
  session: void 0,
  isReady: false,
  isVerified: false
};

type SetCognitoUserAction = {
  type: typeof SET_CURRENT_USER_ACTION;
  payload: { currentUser: string };
};

type SetSessionAction = {
  type: typeof SET_SESSION_ACTION;
  payload: { session: AmazonCognitoIdentity.CognitoUserSession };
};

type ReadyAction = {
  type: typeof READY_ACTION;
  pyload: {};
};

type AuthSupportAction = SetCognitoUserAction | SetSessionAction | ReadyAction;

export const createActions = {
  setCurrentUser: (currentUser: string) => ({
    type: SET_CURRENT_USER_ACTION,
    payload: { currentUser }
  }),
  setSession: (session: AmazonCognitoIdentity.CognitoUserSession) => ({
    type: SET_SESSION_ACTION,
    payload: { session }
  }),
  ready: () => ({ type: READY_ACTION, payload: {} })
};
const isSetCurrentUserAction = (
  action: AuthSupportAction
): action is SetCognitoUserAction => action.type === SET_CURRENT_USER_ACTION;

const isSetSessionAction = (
  action: AuthSupportAction
): action is SetSessionAction => action.type === SET_SESSION_ACTION;

const isReadyAction = (action: AuthSupportAction): action is ReadyAction =>
  action.type === READY_ACTION;

export const reducer = (
  state: AuthSupportState = initialState,
  action: AuthSupportAction
) => {
  if (isSetCurrentUserAction(action)) {
    return { ...state, currentUser: action.payload.currentUser };
  } else if (isSetSessionAction(action)) {
    return { ...state, session: action.payload.session };
  } else if (isReadyAction(action)) {
    return { ...state, isReady: true };
  } else {
    return state;
  }
};
