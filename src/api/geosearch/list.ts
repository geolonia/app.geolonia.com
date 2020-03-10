import { Session, Geosearch, DateStringify } from "../../types";
import fetch from "../custom-fetch";

const listGeosearch = (session: Session, teamId: string) => {
  return fetch<DateStringify<Geosearch>[]>(
    session,
    `/teams/${teamId}/geosearch`,
    { method: "GET" }
  );
};

export default listGeosearch;
