import AmazonCognitoIdentity from "amazon-cognito-identity-js";
import { Member } from "../../redux/actions/team-member";
const { REACT_APP_API_BASE } = process.env;

const updateMember = (
  session: AmazonCognitoIdentity.CognitoUserSession | undefined,
  teamId: string,
  memberSub: string,
  {
    deactivated,
    role
  }: { deactivated?: boolean; role?: "Member" | "Owner" | "Fired" }
) => {
  if (!session) {
    return Promise.reject(new Error("No session found."));
  }

  const idToken = session.getIdToken().getJwtToken();

  return fetch(`${REACT_APP_API_BASE}/teams/${teamId}/members/${memberSub}`, {
    method: "PUT",
    body: JSON.stringify({ deactivated, role }),
    headers: {
      "Content-Type": "Application/json",
      Authorization: idToken
    }
  }).then(res => {
    if (res.ok) {
      return res.json() as Promise<any>;
    } else {
      throw new Error("network error");
    }
  });
};

export default updateMember;
