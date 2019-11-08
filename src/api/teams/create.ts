import { Session, Team } from "../../types";
import fetch from "../custom-fetch";

const createTeam = (session: Session, name: string, billingEmail: string) => {
  return fetch<Team>(session, "/teams", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, billingEmail })
  });
};

export default createTeam;
