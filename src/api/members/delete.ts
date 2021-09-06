import fetch from '../custom-fetch';

const updateMember = (
  session: Geolonia.Session,
  teamId: string,
  memberSub: string,
) => {
  return fetch<any>(session, `/teams/${teamId}/members/${memberSub}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'Application/json',
    },
  });
};

export default updateMember;
