import 'isomorphic-fetch'
import  * as CognitoIdentity  from 'amazon-cognito-identity-js'

const {
  REACT_APP_COGNITO_USERPOOL_ID: UserPoolId,
  REACT_APP_COGNITO_APP_CLIENT_ID: ClientId
} = process.env
const poolData = { UserPoolId, ClientId } as CognitoIdentity.ICognitoUserPoolData

export const signUp = (username: string, email: string, password: string) => new Promise<CognitoIdentity.ISignUpResult>((resolve, reject) => {
    const attributeList = [
      new CognitoIdentity.CognitoUserAttribute({ Name: 'email', Value: email })
    ]
    const userPool = new CognitoIdentity.CognitoUserPool(poolData)

    userPool.signUp(username, password, attributeList, [], (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
