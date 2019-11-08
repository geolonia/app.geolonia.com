import { Session, User } from "../../types";
import fetch from "../custom-fetch";

type UserResponse = {
  item: Omit<User, "links">;
  links: User["links"];
};

const getUser = (session: Session) => {
  const userSub = session && session.getIdToken().decodePayload().sub;

  return fetch<UserResponse>(session, `/users/${userSub}`, {
    method: "GET"
  });
};

export default getUser;
