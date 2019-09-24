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

export const verify = (username: string, code: string) =>
  new Promise((resolve, reject) => {
    const userData = {
      Username: username,
      Pool: userPool
    };
    const cognitoUser = new CognitoIdentity.CognitoUser(userData);
    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });

export const signin = (username: string, password: string) =>
  new Promise<{
    cognitoUser: CognitoIdentity.CognitoUser;
    accessToken: string;
  }>((resolve, reject) => {
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
        // console.log(accessToken);
        // TODO: handle access token here
        resolve({ cognitoUser, accessToken });
      },

      onFailure: reject
    });
  });

export const getSession = () =>
  new Promise<{
    session: CognitoIdentity.CognitoUserSession;
    accessToken: string;
  }>((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser !== null) {
      cognitoUser.getSession(
        (err: Error, session: CognitoIdentity.CognitoUserSession) => {
          if (err) {
            cognitoUser.signOut();
            reject(err);
          } else {
            resolve({
              session,
              accessToken: session.getAccessToken().getJwtToken()
            });
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
    localStorage.clear();
    resolve();
  });

export const sendVerificationEmail = (email: string) =>
  new Promise((resolve, reject) => {
    const cognitoUser = new CognitoIdentity.CognitoUser({
      Username: email,
      Pool: userPool
    });
    if (cognitoUser) {
      cognitoUser.forgotPassword({
        onSuccess: () => resolve(),
        onFailure: err => {
          reject(err.message || JSON.stringify(err));
        }
      });
    }
  });

export const resetPassword = (
  username: string,
  code: string,
  password: string
) => {
  const cognitoUser = new CognitoIdentity.CognitoUser({
    Username: username,
    Pool: userPool
  });
  return new Promise((resolve, reject) => {
    cognitoUser.confirmPassword(code, password, {
      onFailure(err) {
        reject(err);
      },
      onSuccess() {
        resolve();
      }
    });
  });
};

export const changePassword = (oldPassword: string, newPassword: string) =>
  new Promise((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      signin(cognitoUser.getUsername(), oldPassword).then(({ cognitoUser }) => {
        cognitoUser.changePassword(oldPassword, newPassword, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    } else {
      reject();
    }
  });
