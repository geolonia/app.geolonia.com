import AmazonCognitoIdentity from "amazon-cognito-identity-js";
const { REACT_APP_API_BASE } = process.env;

const getUser = (session: AmazonCognitoIdentity.CognitoUserSession) => {
  const userSub = session.getIdToken().decodePayload().sub;
  const accessToken = session.getIdToken().getJwtToken();

  return fetch(`${REACT_APP_API_BASE}/users/${userSub}`, {
    method: "GET",
    headers: {
      Authorization: `bearer ${accessToken}`
    }
  }).then((res: any) => res.json());
};

export default getUser;
