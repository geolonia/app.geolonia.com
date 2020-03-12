import { Session, Geosearch } from "../../types";
import fetch from "../custom-fetch";

const updateGeosearch = (
  session: Session,
  teamId: string,
  geojsonId: string,
  geosearch: Partial<
    Omit<Geosearch, "geojsonId" | "teamId" | "createAt" | "updateAt">
  >
) => {
  return fetch(session, `/teams/${teamId}/geosearch/${geojsonId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(geosearch)
  });
};

export default updateGeosearch;
