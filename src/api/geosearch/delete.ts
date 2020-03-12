import { Session } from "../../types";
import fetch from "../custom-fetch";

const deleteKey = (session: Session, teamId: string, geojsonId: string) => {
  return fetch<any>(session, `/teams/${teamId}/geosearch/${geojsonId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  });
};

export default deleteKey;
