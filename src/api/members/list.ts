import { Session, Member } from "../../types";
import fetch from "../custom-fetch";

const listMembers = (session: Session, teamId: string) => {
  return fetch<Member[]>(session, `/teams/${teamId}/members`, {
    method: "GET"
  });
};

export default listMembers;
