import 'isomorphic-fetch'
import  * as CognitoIdentity  from 'amazon-cognito-identity-js'

const {
  REACT_APP_COGNITO_USERPOOL_ID: UserPoolId,
  REACT_APP_COGNITO_APP_CLIENT_ID: ClientId
} = process.env
const poolData = { UserPoolId, ClientId } as CognitoIdentity.ICognitoUserPoolData
const userPool = new CognitoIdentity.CognitoUserPool(poolData)

export const signUp = (username: string, email: string, password: string) =>
  new Promise<CognitoIdentity.ISignUpResult>((resolve, reject) => {
    const attributeList = [
      new CognitoIdentity.CognitoUserAttribute({ Name: 'email', Value: email })
    ]

    userPool.signUp(username, password, attributeList, [], (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })

export const verify = (username: string, code: string) =>
  new Promise((resolve, reject) => {
    const userData = {
          Username : username,
          Pool : userPool
      };
    const cognitoUser = new CognitoIdentity.CognitoUser(userData);
    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })

  export const signin = (username: string, password: string) =>
    new Promise((resolve, reject) => {
      const cognitoUser = new CognitoIdentity.CognitoUser({
          Username : username,
          Pool : userPool
      })
      const authenticationDetails = new CognitoIdentity.AuthenticationDetails({
        Username: username,
        Password: password
      });
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: result => {
            const accessToken = result.getAccessToken().getJwtToken();
            console.log(accessToken)
            // TODO: handle access token here
            resolve()
        },

        onFailure: reject
        })
    })

export const resetPassword = (...args: any[]) =>
  new Promise((resolve, reject) => {
    // TODO: Implement password reset
    resolve()
  })
