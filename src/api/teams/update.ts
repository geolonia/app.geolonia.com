import AmazonCognitoIdentity from "amazon-cognito-identity-js";
import { Team } from "../../redux/actions/team";
const { REACT_APP_API_BASE } = process.env;

const updateTeam = (
  session: AmazonCognitoIdentity.CognitoUserSession | undefined,
  teamId: string,
  team: Partial<Omit<Team, "teamId">>
) => {
  if (!session) {
    return Promise.reject(new Error("No session found."));
  }

  const idToken = session.getIdToken().getJwtToken();

  return fetch(`${REACT_APP_API_BASE}/teams/${teamId}`, {
    method: "PUT",
    headers: {
      Authorization: idToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ team })
  }).then(res => {
    if (res.ok) {
      return res.json() as Promise<Team>;
    } else {
      console.error(res.json());
      throw new Error("network error");
    }
  });
};

export default updateTeam;
