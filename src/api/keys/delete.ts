import fetch from '../custom-fetch';

const deleteKey = (
  session: Geolonia.Session,
  teamId: string,
  apiKey: string,
) => {
  return fetch<any>(session, `/teams/${teamId}/keys/${apiKey}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export default deleteKey;
