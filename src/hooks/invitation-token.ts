import { useState, useCallback, useEffect } from 'react';
import queryString from 'query-string';
import { useDescribeInvitationQuery, useAcceptInvitationMutation } from '../redux/apis/app-api';

type HookResult = {
  fetchedEmail: string | null,
  isReady: boolean,
  invitationToken: string | null,
  acceptInvitationCallback: () => Promise<void>,
};

// Switch with react-router in the future.
// see https://github.com/geolonia/app.geolonia.com/issues/618
const qs = queryString.parse(window.location.search);
const invitationToken = typeof qs.invitationToken === 'string' ? qs.invitationToken : null;

/**
 * Use invitationToken with search string
 * @param search window.location.search or any search string
 */
export const useInvitationToken = (): HookResult => {

  const [fetchedEmail, setFetchedEmail] = useState<null | string>(null);
  // skip and be ready without invitationToken
  const [isReady, setIsReady] = useState(!invitationToken);

  const { data, isFetching } = useDescribeInvitationQuery(invitationToken || '', {
    skip: !invitationToken,
  });
  console.log(data);

  useEffect(() => {
    if (!isFetching && data && typeof data.email === 'string') {
      setFetchedEmail(data.email);
      setIsReady(true);
    }
  }, [data, isFetching]);

  const [acceptInvitation] = useAcceptInvitationMutation();

  const acceptInvitationCallback = useCallback(async () => {
    if (invitationToken && fetchedEmail) {
      await acceptInvitation({ invitationToken, email: fetchedEmail });
    } else {
      throw new Error('Invalid invitaton token.');
    }
  }, [acceptInvitation, fetchedEmail]);

  return {
    fetchedEmail,
    isReady,
    invitationToken,
    acceptInvitationCallback,
  };
};
