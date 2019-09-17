import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";

const SET_CURRENT_USER_ACTION = "AUTH_SUPPORT/SET_CURRENT_USER_ACTION";
const SET_SESSION_ACTION = "AUTH_SUPPORT/SET_SESSION";

export type AuthSupportState = {
  currentUser?: string;
  session?: AmazonCognitoIdentity.ICognitoUserSessionData;
};

const initialState: AuthSupportState = {
  currentUser: void 0,
  session: void 0
};

type SetCognitoUserAction = {
  type: typeof SET_CURRENT_USER_ACTION;
  payload: { currentUser: string };
};

type SetSessionAction = {
  type: typeof SET_SESSION_ACTION;
  payload: { session: AmazonCognitoIdentity.ICognitoUserSessionData };
};

type AuthSupportAction = SetCognitoUserAction | SetSessionAction;

export const createActions = {
  setCurrentUser: (currentUser: string) => ({
    type: SET_CURRENT_USER_ACTION,
    payload: { currentUser }
  }),
  setSession: (session: AmazonCognitoIdentity.ICognitoUserSessionData) => ({
    type: SET_SESSION_ACTION,
    payload: { session }
  })
};
const isSetCurrentUserAction = (
  action: AuthSupportAction
): action is SetCognitoUserAction => action.type === SET_CURRENT_USER_ACTION;

const isSetSessionAction = (
  action: AuthSupportAction
): action is SetSessionAction => action.type === SET_SESSION_ACTION;

export const reducer = (
  state: AuthSupportState = initialState,
  action: AuthSupportAction
) => {
  if (isSetCurrentUserAction(action)) {
    return { ...state, currentUser: action.payload.currentUser };
  } else if (isSetSessionAction(action)) {
    return { ...state, session: action.payload.session };
  } else {
    return state;
  }
};
