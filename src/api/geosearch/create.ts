import { Session, GeoSearch, DateStringify } from "../../types";
import fetch from "../custom-fetch";

const createKey = (session: Session, teamId: string, name: string) => {
  return fetch<DateStringify<GeoSearch>>(
    session,
    `/teams/${teamId}/geosearch`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name })
    }
  );
};

export default createKey;
