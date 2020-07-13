import fetch from "../custom-fetch";
type FetchResult = Geolonia.DateStringify<Geolonia.Key>;

const createKey = (session: Geolonia.Session, teamId: string, name: string) => {
  return fetch<FetchResult>(session, `/teams/${teamId}/keys`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name })
  });
};

export default createKey;
