import { Session, User } from "../../types";
const { REACT_APP_API_BASE } = process.env;

const getUser = (session: Session) => {
  if (!session) {
    return Promise.reject("no session found");
  }

  const userSub = session.getIdToken().decodePayload().sub;
  const idToken = session.getIdToken().getJwtToken();

  return fetch(`${REACT_APP_API_BASE}/users/${userSub}`, {
    method: "GET",
    headers: {
      Authorization: idToken
    }
  }).then(res => {
    if (res.ok) {
      return res.json().then(json => {
        const { item, links } = json;
        return { ...item, links };
      }) as Promise<User>;
    } else {
      throw new Error("network error");
    }
  });
};

export default getUser;
