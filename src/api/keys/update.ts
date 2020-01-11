import { Session, Key } from "../../types";
import fetch from "../custom-fetch";

const updateTeam = (
  session: Session,
  teamId: string,
  mapKey: string,
  key: Partial<
    Omit<
      Key,
      "teamId" | "keyId" | "userKey" | "updateAt" | "createAt" | "forceDisabled"
    >
  >
) => {
  return fetch(session, `/teams/${teamId}/keys/${mapKey}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(key)
  });
};

export default updateTeam;
