import fetch from '../custom-fetch';

const createTeam = (
  session: Geolonia.Session,
  name: string,
  billingEmail: string,
) => {
  return fetch<Geolonia.Team>(session, '/teams', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, billingEmail }),
  });
};

export default createTeam;
