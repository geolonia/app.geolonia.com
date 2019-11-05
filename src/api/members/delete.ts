import { Session } from "../../types";
const { REACT_APP_API_BASE } = process.env;

const updateMember = (session: Session, teamId: string, memberSub: string) => {
  if (!session) {
    return Promise.reject(new Error("No session found."));
  }

  const idToken = session.getIdToken().getJwtToken();

  return fetch(`${REACT_APP_API_BASE}/teams/${teamId}/members/${memberSub}`, {
    method: "DELETE",
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
