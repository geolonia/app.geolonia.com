import { Session, User } from "../../types";
const { REACT_APP_API_BASE } = process.env;
const failure = Symbol("request failed");

const updateUser = (session: Session, userMeta: User) => {
  if (!session) {
    throw new Error("Unknown Error. No session found.");
  }

  const userSub = session.getIdToken().decodePayload().sub;
  const idToken = session.getIdToken().getJwtToken();

  const pickedProps = {
    name: userMeta.name,
    language: userMeta.language,
    timezone: userMeta.timezone
  };

  return fetch(`${REACT_APP_API_BASE}/users/${userSub}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: idToken
    },
    body: JSON.stringify(pickedProps)
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        return res.json().then(data => ({ ...data, [failure]: true }));
      }
    })
    .then(data => {
      if (data[failure]) {
        console.error(data);
        throw new Error("Request failed");
      } else {
        return data;
      }
    });
};

export default updateUser;
