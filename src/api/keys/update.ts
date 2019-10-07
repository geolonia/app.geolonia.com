import AmazonCognitoIdentity from "amazon-cognito-identity-js";
import { Team } from "../../redux/actions/team";
import { Key } from "../../redux/actions/map-key";
const { REACT_APP_API_BASE } = process.env;

const updateTeam = (
  session: AmazonCognitoIdentity.CognitoUserSession | undefined,
  teamId: string,
  mapKey: string,
  key: Partial<
    Omit<Key, "teamId" | "userKey" | "updateAt" | "createAt" | "forceDisabled">
  >
) => {
  if (!session) {
    return Promise.reject(new Error("No session found."));
  }
  const idToken = session.getIdToken().getJwtToken();

  return fetch(`${REACT_APP_API_BASE}/teams/${teamId}/keys/${mapKey}`, {
    method: "PUT",
    headers: {
      Authorization: idToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(key)
  }).then(res => {
    if (res.ok) {
      return res.json();
    } else {
      console.error(res.json());
      throw new Error("network error");
    }
  });
};

export default updateTeam;
