import { Session, Role } from "../../types";
import fetch from "../custom-fetch";

const updateMember = (
  session: Session,
  teamId: string,
  memberSub: string,
  role: Role
) => {
  return fetch<any>(session, `/teams/${teamId}/members/${memberSub}`, {
    method: "PUT",
    body: JSON.stringify({ role }),
    headers: {
      "Content-Type": "Application/json"
    }
  });
};

export default updateMember;
