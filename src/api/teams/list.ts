import fetch from '../custom-fetch';

const listTeams = (session: Geolonia.Session) => {
  return fetch<Geolonia.Team[]>(session, '/teams', {
    method: 'GET',
  });
};

export default listTeams;
