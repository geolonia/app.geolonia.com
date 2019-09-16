
const SET_CURRENT_USER_ACTION = 'AUTH_SUPPORT/SET_CURRENT_USER_ACTION'
const initialState: AuthSupportState = {
  currentUser: void 0,
}

export type AuthSupportState = {
  currentUser?: string
}

type SetCognitoUserAction = {
  type: typeof SET_CURRENT_USER_ACTION,
  payload: { currentUser: string }
}

type AuthSupportAction = SetCognitoUserAction

export const createActions = {
  setCurrentUser: (currentUser: string) => ({
    type: SET_CURRENT_USER_ACTION,
    payload: { currentUser }
  })
}
const isSetCurrentUserAction = (action: AuthSupportAction): action is SetCognitoUserAction => action.type === SET_CURRENT_USER_ACTION

export const reducer = (state: AuthSupportState = initialState, action: AuthSupportAction) => {
  if (isSetCurrentUserAction(action)) {
    return {...state, currentUser: action.payload.currentUser}
  } else {
    return state
  }
}
