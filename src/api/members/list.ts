import { Session, Member } from "../../types";
const { REACT_APP_API_BASE } = process.env;

const listMembers = (session: Session, teamId: string) => {
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
      console.error(res.text());
      throw new Error("network error");
    }
  });
};

export default listMembers;
