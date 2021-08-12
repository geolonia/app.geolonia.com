import fetch from '../custom-fetch';

type TeamUpdateParam = Partial<
Omit<Geolonia.Team, 'teamId' | 'role' | 'avatarImage' | 'links' | 'isDeleted'>
>;

const updateTeam = (
  session: Geolonia.Session,
  teamId: string,
  team: TeamUpdateParam,
) => {
  return fetch<any>(session, `/teams/${teamId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(team),
  });
};

export default updateTeam;
