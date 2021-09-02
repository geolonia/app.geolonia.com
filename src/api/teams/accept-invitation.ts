import { buildApiAppUrl } from '../../lib/api';

export const describeInvitation = (invitationToken: string) => {
  const fetchOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'Application/json' },
  };
  const url = buildApiAppUrl(`/invitation/${invitationToken}`);
  return fetch(url, fetchOptions);
};

export const acceptInvitation = (invitationToken: string, email: string) => {
  const fetchOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'Application/json' },
    body: JSON.stringify({ invitationToken, email }),
  };
  const url = buildApiAppUrl('/accept-invitation');
  return fetch(url, fetchOptions);
};
