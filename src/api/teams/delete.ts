import fetch from '../custom-fetch';

const deleteTeam = (session: Geolonia.Session, teamId: string) => {
  return fetch<any>(session, `/teams/${teamId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export default deleteTeam;
