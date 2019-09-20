import "isomorphic-fetch";
import * as CognitoIdentity from "amazon-cognito-identity-js";

const {
  REACT_APP_COGNITO_USERPOOL_ID: UserPoolId,
  REACT_APP_COGNITO_APP_CLIENT_ID: ClientId
} = process.env;
const poolData = {
  UserPoolId,
  ClientId
} as CognitoIdentity.ICognitoUserPoolData;
const userPool = new CognitoIdentity.CognitoUserPool(poolData);

export const signUp = (username: string, email: string, password: string) =>
  new Promise<CognitoIdentity.ISignUpResult>((resolve, reject) => {
    const attributeList = [
      new CognitoIdentity.CognitoUserAttribute({ Name: "email", Value: email })
    ];

    userPool.signUp(username, password, attributeList, [], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });

export const signin = (username: string, password: string) =>
  new Promise((resolve, reject) => {
    const cognitoUser = new CognitoIdentity.CognitoUser({
      Username: username,
      Pool: userPool
    });
    const authenticationDetails = new CognitoIdentity.AuthenticationDetails({
      Username: username,
      Password: password
    });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: result => {
        const accessToken = result.getAccessToken().getJwtToken();
        console.log(accessToken);
        // TODO: handle access token here
        resolve();
      },

      onFailure: reject
    });
  });

export const getSession = () =>
  new Promise<CognitoIdentity.CognitoUserSession>((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser !== null) {
      cognitoUser.getSession(
        (err: Error, session: CognitoIdentity.CognitoUserSession) => {
          if (err) {
            cognitoUser.signOut();
            reject(err);
          } else {
            resolve(session);
          }
        }
      );
    } else {
      reject(null);
    }
  });

export const signout = () =>
  new Promise(resolve => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut();
    }
    resolve();
  });

export const resetPassword = (...args: any[]) =>
  new Promise((resolve, reject) => {
    // TODO: Implement password reset
    resolve();
  });

export const changePassword = (username: string, oldpassword: string) =>
  new Promise((resolve, reject) => {
    const cognitoUser = new CognitoIdentity.CognitoUser({
      Username: username,
      Pool: userPool
    });
  });
