import { useEffect, useState } from 'react';
import queryString from 'query-string';
import { describeInvitation, acceptInvitation } from '../api/teams/accept-invitation';

type HookResult = {
  fetchedEmail: string | null,
  isReady: boolean,
  invitationToken: string | null,
  acceptInvitationCallback: () => Promise<void>,
};

/**
 * Use invitationToken with search string
 * @param search window.location.search or any search string
 */
export const useInvitationToken = (search: string): HookResult => {
  const [invitationToken, setInvitationToken] = useState<null | string>(null);
  const [fetchedEmail, setFetchedEmail] = useState<null | string>(null);
  const [isReady, setIsReady] = useState(false);

  const fetchInvitationData = async (invitationToken: string) => {
    try {
      const res = await describeInvitation(invitationToken);
      const {email} = await res.json();
      if(typeof email === 'string') {
        setFetchedEmail(email);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setIsReady(true);
    }
  };

  useEffect(() => {
    const parsed = queryString.parse(search);
    if(typeof parsed.invitationToken === 'string') {
      setInvitationToken(parsed.invitationToken);
      fetchInvitationData(parsed.invitationToken);
      setIsReady(true);
    } else {
      setIsReady(true);
    }
  }, [search]);

  return {
    fetchedEmail,
    isReady,
    invitationToken,
    acceptInvitationCallback: async () => {
      if(invitationToken && fetchedEmail) {
        await acceptInvitation(invitationToken, fetchedEmail);
      } else {
        throw new Error('Invalid invitaton token.');
      }
    },
  };
};
