import { Session, FeatureCollections, ErrorCodes } from "../../types";
import fetch from "../custom-fetch";
import generate from "./mock";

// eslint-disable-next-line
const listFeatureCollections = (session: Session, teamId: string) => {
  return fetch<FeatureCollections>(
    session,
    `/teams/${teamId}/features`,
    { method: "GET" },
    { type: "geosearch" }
  );
};

const mockListFeatureCollections = (session: Session, teamId: string) => {
  return Promise.resolve<
    | { error: true; code: ErrorCodes; message: "dammy" }
    | { error: false; data: FeatureCollections }
  >({ error: false, data: generate() });
};

export default mockListFeatureCollections;
