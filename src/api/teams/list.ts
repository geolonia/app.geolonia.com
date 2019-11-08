import { Session, Team } from "../../types";
import fetch from "../custom-fetch";

const listTeams = (session: Session) => {
  return fetch<Team[]>(session, `/teams`, {
    method: "GET"
  });
};

export default listTeams;
