import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";

const SET_CURRENT_USER_ACTION = "AUTH_SUPPORT/SET_CURRENT_USER_ACTION";
const SET_SESSION_ACTION = "AUTH_SUPPORT/SET_SESSION";
const SET_ACCESS_TOKEN = "AUTH_SUPPORT/SET_ACCESS_TOKEN";
const GET_IN_TROUBLE_ACTION = "AUTH_SUPORT/GET_IN_TROUBLE";
const READY_ACTION = "AUTH_SUPPORT/READY";

export type State = {
  currentUser?: string;
  session?: AmazonCognitoIdentity.CognitoUserSession;
  accessToken?: string;
  hasTrouble: boolean;
  isReady: boolean;
  isVerified: boolean;
};

const initialState: State = {
  currentUser: void 0,
  session: void 0,
  accessToken: void 0,
  hasTrouble: false,
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

type SetAccessTokenAction = {
  type: typeof SET_ACCESS_TOKEN;
  payload: { accessToken: string };
};

type GetInTroubleAction = {
  type: typeof GET_IN_TROUBLE_ACTION;
  payload: {};
};

type ReadyAction = {
  type: typeof READY_ACTION;
  payload: {};
};

type AuthSupportAction =
  | SetCognitoUserAction
  | SetSessionAction
  | SetAccessTokenAction
  | GetInTroubleAction
  | ReadyAction;

export const createActions = {
  setCurrentUser: (currentUser: string) => ({
    type: SET_CURRENT_USER_ACTION,
    payload: { currentUser }
  }),
  setSession: (session: AmazonCognitoIdentity.CognitoUserSession) => ({
    type: SET_SESSION_ACTION,
    payload: { session }
  }),
  setAccessToken: (accessToken: string) => ({
    type: SET_ACCESS_TOKEN,
    payload: { accessToken }
  }),
  encounterTrouble: () => ({ type: GET_IN_TROUBLE_ACTION, payload: {} }),
  ready: () => ({ type: READY_ACTION, payload: {} })
};
const isSetCurrentUserAction = (
  action: AuthSupportAction
): action is SetCognitoUserAction => action.type === SET_CURRENT_USER_ACTION;

const isSetSessionAction = (
  action: AuthSupportAction
): action is SetSessionAction => action.type === SET_SESSION_ACTION;

const isSetAccessTokenAction = (
  action: AuthSupportAction
): action is SetAccessTokenAction => action.type === SET_ACCESS_TOKEN;

const isGetInTroubleAction = (
  action: AuthSupportAction
): action is GetInTroubleAction => action.type === GET_IN_TROUBLE_ACTION;

const isReadyAction = (action: AuthSupportAction): action is ReadyAction =>
  action.type === READY_ACTION;

export const reducer = (
  state: State = initialState,
  action: AuthSupportAction
) => {
  if (isSetCurrentUserAction(action)) {
    return { ...state, currentUser: action.payload.currentUser };
  } else if (isSetSessionAction(action)) {
    return { ...state, session: action.payload.session };
  } else if (isSetAccessTokenAction(action)) {
    return { ...state, accessToken: action.payload.accessToken };
  } else if (isGetInTroubleAction(action)) {
    return { ...state, hasTrouble: true };
  } else if (isReadyAction(action)) {
    return { ...state, isReady: true };
  } else {
    return state;
  }
};
