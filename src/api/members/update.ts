import fetch from '../custom-fetch';

const updateMember = (
  session: Geolonia.Session,
  teamId: string,
  memberSub: string,
  role: Geolonia.Role,
) => {
  return fetch<any>(session, `/teams/${teamId}/members/${memberSub}`, {
    method: 'PUT',
    body: JSON.stringify({ role }),
    headers: {
      'Content-Type': 'Application/json',
    },
  });
};

export default updateMember;
