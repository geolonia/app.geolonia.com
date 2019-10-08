import AmazonCognitoIdentity from "amazon-cognito-identity-js";
import { Member } from "../../redux/actions/team-member";
const { REACT_APP_API_BASE } = process.env;

const listMembers = (
  session: AmazonCognitoIdentity.CognitoUserSession | undefined,
  teamId: string
) => {
  if (!session) {
    return Promise.reject(new Error("No session found."));
  }

  const idToken = session.getIdToken().getJwtToken();

  return fetch(`${REACT_APP_API_BASE}/teams/${teamId}/members`, {
    method: "GET",
    headers: {
      Authorization: idToken
    }
  }).then(res => {
    if (res.ok) {
      return res.json() as Promise<Member[]>;
    } else {
      throw new Error("network error");
    }
  });
};

export default listMembers;
