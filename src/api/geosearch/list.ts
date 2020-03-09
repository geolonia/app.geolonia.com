import { Session, FeatureCollection, DateStringify } from "../../types";
import fetch from "../custom-fetch";

// eslint-disable-next-line
const listFeatureCollections = (session: Session, teamId: string) => {
  return fetch<DateStringify<FeatureCollection>[]>(
    session,
    `/teams/${teamId}/geosearch`,
    { method: "GET" }
  );
};

export default listFeatureCollections;
