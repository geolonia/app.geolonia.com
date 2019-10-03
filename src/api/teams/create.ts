import AmazonCognitoIdentity from "amazon-cognito-identity-js";
const { REACT_APP_API_BASE } = process.env;

const createTeam = (
  session: AmazonCognitoIdentity.CognitoUserSession,
  teamName: string
) => {
  const idToken = session.getIdToken().getJwtToken();

  return fetch(`${REACT_APP_API_BASE}/teams`, {
    method: "POST",
    headers: {
      Authorization: idToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ teamName })
    // TODO: handle 40x, 50x
  }).then((res: any) => res.json());
};

export default createTeam;
