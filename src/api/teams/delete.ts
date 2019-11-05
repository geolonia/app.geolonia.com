import { Session } from "../../types";
const { REACT_APP_API_BASE } = process.env;

const deleteTeam = (session: Session, teamId: string) => {
  if (!session) {
    return Promise.reject(new Error("No session found."));
  }

  const idToken = session.getIdToken().getJwtToken();

  return fetch(`${REACT_APP_API_BASE}/teams/${teamId}`, {
    method: "DELETE",
    headers: {
      Authorization: idToken,
      "Content-Type": "application/json"
    }
  }).then(res => {
    if (res.ok) {
      return res.json();
    } else {
      console.error(res.json());
      throw new Error("network error");
    }
  });
};

export default deleteTeam;
