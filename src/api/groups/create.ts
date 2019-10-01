import AmazonCognitoIdentity from "amazon-cognito-identity-js";
const { REACT_APP_API_BASE } = process.env;

const createGroups = (
  session: AmazonCognitoIdentity.CognitoUserSession,
  groupName: string
) => {
  const idToken = session.getIdToken().getJwtToken();

  return fetch(`${REACT_APP_API_BASE}/groups`, {
    method: "POST",
    headers: {
      Authorization: idToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ groupName })
    // TODO: handle 40x, 50x
  }).then((res: any) => res.json());
};

export default createGroups;
