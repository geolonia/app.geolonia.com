import { useEffect, useState } from 'react';
import queryString from 'query-string';
import { describeInvitation, acceptInvitation } from '../api/teams/accept-invitation';

type HookResult = [ fetchedEmail: string | null, acceptInvitationCallback: () => Promise<void> ];

export const useInvitationToken = (search: string): HookResult => {
  const [invitationToken, setInvitationToken] = useState<null | string>(null);
  const [fetchedEmail, setFetchedEmail] = useState<null | string>(null);

  const fetchInvitationData = async (invitationToken: string) => {
    const res = await describeInvitation(invitationToken);
    const { email } = await res.json();
    if(typeof email === 'string') {
      setFetchedEmail(email);
    }
  };

  useEffect(() => {
    const parsed = queryString.parse(search);
    if(typeof parsed.invitationToken === 'string') {
      setInvitationToken(parsed.invitationToken);
      fetchInvitationData(parsed.invitationToken);
    }
  }, [search]);

  return [
    fetchedEmail,
    async () => {
      if(invitationToken && fetchedEmail) {
        await acceptInvitation(invitationToken, fetchedEmail);
      } else {
        throw new Error('Invalid invitaton token.');
      }
    },
  ];
};
