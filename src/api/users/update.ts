import fetch from "../custom-fetch";

const updateUser = (session: Geolonia.Session, user: Geolonia.User) => {
  const userSub = session && session.getIdToken().decodePayload().sub;

  return fetch<any>(session, `/users/${userSub}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  });
};

export default updateUser;
