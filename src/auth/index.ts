// @file Wrapper for Cognito related API

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
    // TODO: if we have more language option, let's extend
    const language = navigator.language.slice(0, 2) === "ja" ? "ja" : "en";
    const attributeList = [
      new CognitoIdentity.CognitoUserAttribute({ Name: "email", Value: email }),
      new CognitoIdentity.CognitoUserAttribute({
        Name: "locale",
        Value: language
      })
    ];

    userPool.signUp(username, password, attributeList, [], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });

export const requestVerificationCode = (identity: string) => {
  const userPool = new CognitoIdentity.CognitoUserPool(poolData);

  return new Promise((resolve, reject) => {
    const userData = {
      Username: identity,
      Pool: userPool
    };

    const cognitoUser = new CognitoIdentity.CognitoUser(userData);
    cognitoUser.resendConfirmationCode((err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

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
    session: CognitoIdentity.CognitoUserSession;
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
        const accessToken = result.getIdToken().getJwtToken();
        cognitoUser.getSession(
          (err: any, session: CognitoIdentity.CognitoUserSession) => {
            if (err) {
              reject(err);
            } else {
              resolve({ cognitoUser, session, accessToken });
            }
          }
        );
      },
      onFailure: err => {
        reject(err);
      }
    });
  });

export const getSession = () =>
  new Promise<CognitoIdentity.CognitoUserSession | null>((resolve, reject) => {
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
      resolve(null);
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

/**
 *
 * @param identity username or email
 */
export const sendVerificationEmail = (identity: string) =>
  new Promise((resolve, reject) => {
    const cognitoUser = new CognitoIdentity.CognitoUser({
      Username: identity,
      Pool: userPool
    });
    if (cognitoUser) {
      cognitoUser.forgotPassword({
        onSuccess: () => resolve(true),
        onFailure: err => {
          reject(err);
        }
      });
    }
  });

/**
 *
 * @param identity username or email
 */
export const resetPassword = (
  identity: string,
  code: string,
  password: string
) => {
  const cognitoUser = new CognitoIdentity.CognitoUser({
    Username: identity,
    Pool: userPool
  });
  return new Promise((resolve, reject) => {
    cognitoUser.confirmPassword(code, password, {
      onFailure(err) {
        reject(err);
      },
      onSuccess() {
        resolve(true);
      }
    });
  });
};

export const changePassword = (oldPassword: string, newPassword: string) =>
  new Promise((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      const username = cognitoUser.getUsername();
      return signin(username, oldPassword)
        .then(({ cognitoUser }) => {
          cognitoUser.changePassword(oldPassword, newPassword, err => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        })
        .catch(err => reject(err));
    } else {
      reject(new Error("No user found."));
    }
  });

// NOTE: not tested
export const changeEmail = (email: string) => {
  return new Promise((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      const attr: CognitoIdentity.ICognitoUserAttributeData = {
        Name: "email",
        Value: email
      };
      cognitoUser.updateAttributes([attr], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    } else {
      reject();
    }
  });
};
