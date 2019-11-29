import { Session, Key, DateStringify } from "../../types";
import fetch from "../custom-fetch";

const createKey = (session: Session, teamId: string, name: string) => {
  return fetch<DateStringify<Key>>(session, `/teams/${teamId}/keys`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name })
  });
};

export default createKey;
