import { Session, Team } from "../../types";
const { REACT_APP_API_BASE } = process.env;

const createTeam = (session: Session, name: string, billingEmail: string) => {
  if (!session) {
    return Promise.reject(new Error("No session found."));
  }

  const idToken = session.getIdToken().getJwtToken();

  return fetch(`${REACT_APP_API_BASE}/teams`, {
    method: "POST",
    headers: {
      Authorization: idToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, billingEmail })
  }).then(res => {
    if (res.ok) {
      return res.json() as Promise<Team>;
    } else {
      throw new Error("network error");
    }
  });
};

export default createTeam;
