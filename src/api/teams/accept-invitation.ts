import { buildApiAppUrl } from '../../lib/api';
import customFetch from '../../lib/fetch';

export const acceptInvitation = (invitationToken: string, session?: Geolonia.Session) => {
  const fetchOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'Application/json' },
    body: JSON.stringify({ invitationToken }),
  };

  if(session) {
    const url = buildApiAppUrl('/accept-team-invitation');
    return customFetch(session, url, fetchOptions);
  } else {
    const url = buildApiAppUrl('/accept-invitation');
    return fetch(url, fetchOptions);
  }
};
