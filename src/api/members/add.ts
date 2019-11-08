import { Session, Member, errorCodes, ErrorCodes } from "../../types";
import fetch from "../custom-fetch";

const addMember = (session: Session, teamId: string, email: string) => {
  return fetch<Member>(session, `/teams/${teamId}/members`, {
    method: "POST",
    body: JSON.stringify({ email }),
    headers: {
      "Content-Type": "Application/json"
    }
  });
};

export default addMember;
