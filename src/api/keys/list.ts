import { Session, Key } from "../../types";
import fetch from "../custom-fetch";

const listKeys = (session: Session, teamId: string) => {
  return fetch<Key[]>(session, `/teams/${teamId}/keys`, {
    method: "GET"
  });
};

export default listKeys;
