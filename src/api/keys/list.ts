import { Session, Key, DateStringify } from "../../types";
import fetch from "../custom-fetch";

const listKeys = (session: Session, teamId: string) => {
  return fetch<DateStringify<Key>[]>(session, `/teams/${teamId}/keys`, {
    method: "GET"
  });
};

export default listKeys;
