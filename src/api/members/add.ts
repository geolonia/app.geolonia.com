import fetch from "../custom-fetch";

const addMember = (
  session: Geolonia.Session,
  teamId: string,
  email: string
) => {
  return fetch<Geolonia.Member>(session, `/teams/${teamId}/members`, {
    method: "POST",
    body: JSON.stringify({ email }),
    headers: {
      "Content-Type": "Application/json"
    }
  });
};

export default addMember;
