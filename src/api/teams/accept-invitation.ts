import { buildApiAppUrl } from '../../lib/api';

export const acceptInvitation = (invitationToken: string, email: string) => {
  const fetchOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'Application/json' },
    body: JSON.stringify({ invitationToken, email }),
  };
  const url = buildApiAppUrl('/accept-invitation');
  return fetch(url, fetchOptions);
};
