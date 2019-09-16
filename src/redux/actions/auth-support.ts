import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js'

const SET_COGNITO_USER_ACTION = 'AUTH_SUPPORT/SET_COGNITO_USER_ACTION'
const initialState: AuthSupportState = {
  cognitoUser: void 0,
}

export type AuthSupportState = {
  cognitoUser?: AmazonCognitoIdentity.CognitoUser
}

type SetCognitoUserAction = {
  type: typeof SET_COGNITO_USER_ACTION,
  payload: {cognitoUser: AmazonCognitoIdentity.CognitoUser}
}

type AuthSupportAction = SetCognitoUserAction

export const createActions = {
  setCognitoUser: (cognitoUser: AmazonCognitoIdentity.CognitoUser) => ({
    type: SET_COGNITO_USER_ACTION,
    payload: { cognitoUser }
  })
}
const isSetCognitoUserAction = (action: AuthSupportAction): action is SetCognitoUserAction => action.type === SET_COGNITO_USER_ACTION

export const reducer = (state: AuthSupportState = initialState, action: AuthSupportAction) => {
  if (isSetCognitoUserAction(action)) {
    return {...state, cognitoUser: action.payload.cognitoUser}
  } else {
    return state
  }
}
