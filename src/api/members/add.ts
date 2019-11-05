import { Session, Member } from "../../types";
const { REACT_APP_API_BASE } = process.env;

const addMember = (session: Session, teamId: string, email: string) => {
  if (!session) {
    return Promise.reject(new Error("No session found."));
  }

  const idToken = session.getIdToken().getJwtToken();

  return fetch(`${REACT_APP_API_BASE}/teams/${teamId}/members`, {
    method: "POST",
    body: JSON.stringify({ email }),
    headers: {
      "Content-Type": "Application/json",
      Authorization: idToken
    }
  }).then(res => {
    if (res.ok) {
      return res.json() as Promise<Member>;
    } else {
      throw new Error("network error");
    }
  });
};

export default addMember;
