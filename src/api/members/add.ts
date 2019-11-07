import { Session, Member, errorCodes, ErrorCodes } from "../../types";
const { REACT_APP_API_BASE } = process.env;

type AddMemberResult =
  | {
      member: Member;
      error: false;
    }
  | {
      errorCode: ErrorCodes;
      error: true;
    };

const addMember = (session: Session, teamId: string, email: string) => {
  if (!session) {
    return Promise.reject(new Error("No session found."));
  }

  const idToken = session.getIdToken().getJwtToken();

  return fetch(`${REACT_APP_API_BASE}/teams/${teamId}/members`, {
    method: "POST",
    body: JSON.stringify({ email }),
    headers: {
      "Content-Type": "Application/json",
      Authorization: idToken
    }
  }).then<AddMemberResult>(res => {
    if (res.ok) {
      return res.json().then((member: Member) => ({ member, error: false }));
    } else {
      if (res.status === 403) {
        return { error: true, errorCode: errorCodes.UnAuthorized };
      } else {
        throw new Error("network error");
      }
    }
  });
};

export default addMember;
