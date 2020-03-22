import { Session, Geosearch, DateStringify } from "../../types";
import fetch from "../custom-fetch";

const createKey = (session: Session, teamId: string, name: string) => {
  const body: Omit<Geosearch, "geojsonId" | "updateAt" | "createAt"> = {
    name,
    isPublic: false,
    data: {
      type: "FeatureCollection",
      features: []
    }
  };
  return fetch<DateStringify<Geosearch>>(
    session,
    `/teams/${teamId}/geosearch`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }
  );
};

export default createKey;
