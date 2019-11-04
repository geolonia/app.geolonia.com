import { Session, Key } from "../../types";
const { REACT_APP_API_BASE } = process.env;

const listKeys = (session: Session, teamId: string) => {
  if (!session) {
    return Promise.reject(new Error("No session found."));
  }

  const idToken = session.getIdToken().getJwtToken();

  return fetch(`${REACT_APP_API_BASE}/teams/${teamId}/keys`, {
    method: "GET",
    headers: {
      Authorization: idToken
    }
  }).then(res => {
    if (res.ok) {
      return res.json() as Promise<Key[]>;
    } else {
      throw new Error("network error");
    }
  });
};

export default listKeys;
