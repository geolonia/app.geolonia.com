import AmazonCognitoIdentity from "amazon-cognito-identity-js";
const { REACT_APP_API_BASE } = process.env;

const updateAvatar = (
  session: AmazonCognitoIdentity.CognitoUserSession,
  base64Image: string
) => {
  const userSub = session.getIdToken().decodePayload().sub;
  const idToken = session.getIdToken().getJwtToken();
  return fetch(`${REACT_APP_API_BASE}/users/${userSub}/avatar`, {
    method: "PUT",
    headers: {
      Authorization: idToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ base64Image })
  })
    .then((res: any) => res.json())
    .then(() => `${REACT_APP_API_BASE}/users/${userSub}/avatar`);
};

export default updateAvatar;
