import { buildApiAppUrl } from '../../lib/api';
import customFetch from '../../lib/fetch';

export const acceptInvitation = (invitationToken: string, session?: Geolonia.Session) => {
  const url = buildApiAppUrl('/accept-invitation');
  const fetchOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'Application/json' },
    body: JSON.stringify({ invitationToken }),
  };

  if(session) {
    return customFetch(session, url, fetchOptions);
  } else {
    return fetch(url, fetchOptions);
  }
};
