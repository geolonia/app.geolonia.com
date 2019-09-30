import AmazonCognitoIdentity from "amazon-cognito-identity-js";
const { REACT_APP_API_BASE } = process.env;

const listGroups = (session: AmazonCognitoIdentity.CognitoUserSession) => {
  const idToken = session.getIdToken().getJwtToken();

  return fetch(`${REACT_APP_API_BASE}/groups`, {
    method: "GET",
    headers: {
      Authorization: idToken
    }
    // TODO: handle 40x, 50x
  }).then((res: any) => res.json());
};

export default listGroups;
