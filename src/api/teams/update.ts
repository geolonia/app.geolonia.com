import { Session, Team } from "../../types";
import fetch from "../custom-fetch";

type WritableTeam = Partial<
  Omit<Team, "teamId" | "role" | "avatarImage" | "links" | "isDeleted">
>;

const updateTeam = (session: Session, teamId: string, team: WritableTeam) => {
  return fetch<any>(session, `/teams/${teamId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(team)
  });
};

export default updateTeam;
