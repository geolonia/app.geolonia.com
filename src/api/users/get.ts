// TODO: 削除中
import fetch from '../custom-fetch';

type FetchResult = {
  item: Omit<Geolonia.User, 'links'>;
  links: Geolonia.User['links'];
};

const getUser = (session: Geolonia.Session) => {
  const userSub = session && session.getIdToken().decodePayload().sub;

  return fetch<FetchResult>(session, `/users/${userSub}`, {
    method: 'GET',
  });
};

export default getUser;
