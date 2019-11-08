import { Session } from "../../types";
import fetch from "../custom-fetch";

const updateMember = (session: Session, teamId: string, memberSub: string) => {
  return fetch<any>(session, `/teams/${teamId}/members/${memberSub}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "Application/json"
    }
  });
};

export default updateMember;
