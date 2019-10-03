import AmazonCognitoIdentity from "amazon-cognito-identity-js";
import { Team } from "../../redux/actions/team";
const { REACT_APP_API_BASE } = process.env;

const listTeams = (session: AmazonCognitoIdentity.CognitoUserSession) => {
  const idToken = session.getIdToken().getJwtToken();

  return fetch(`${REACT_APP_API_BASE}/teams`, {
    method: "GET",
    headers: {
      Authorization: idToken
    }
  }).then(res => {
    if (res.ok) {
      return res.json() as Promise<Team[]>;
    } else {
      throw new Error("network error");
    }
  });
};

export default listTeams;
