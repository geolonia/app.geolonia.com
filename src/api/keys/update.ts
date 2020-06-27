import fetch from "../custom-fetch";

type KeyUpdateParams = Partial<
  Omit<
    Geolonia.Key,
    "teamId" | "keyId" | "userKey" | "updateAt" | "createAt" | "forceDisabled"
  >
>;

const updateTeam = (
  session: Geolonia.Session,
  teamId: string,
  mapKey: string,
  key: KeyUpdateParams
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
