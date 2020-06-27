import fetch from "../custom-fetch";
type FetchResult = Geolonia.Member[];

const listMembers = (session: Geolonia.Session, teamId: string) => {
  return fetch<FetchResult>(session, `/teams/${teamId}/members`, {
    method: "GET"
  });
};

export default listMembers;
