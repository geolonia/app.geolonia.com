import fetch from '../custom-fetch';
type FetchResult = Geolonia.DateStringify<Geolonia.Key>[];

const listKeys = (session: Geolonia.Session, teamId: string) => {
  return fetch<FetchResult>(session, `/teams/${teamId}/keys`, {
    method: 'GET',
  });
};

export default listKeys;
