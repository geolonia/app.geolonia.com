import { buildApiAppUrl } from '../../lib/api';

export const acceptInvitation = (invitationToken: string) => fetch(
  buildApiAppUrl('/accept-invitation'),
  {
    method: 'POST',
    headers: { 'Content-Type': 'Application/json' },
    body: JSON.stringify({ invitationToken }),
  },
);
