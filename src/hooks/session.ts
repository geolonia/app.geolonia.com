import * as CognitoIdentity from 'amazon-cognito-identity-js';
import { useEffect, useState } from 'react';
import { getSession, refreshSession } from '../auth';

export const useSession = () => {
  const [session, setSession] = useState<null | CognitoIdentity.CognitoUserSession >(null);
  useEffect(() => {
    (async () => {
      let session = await getSession();
      if (session === null) {
        return;
      } else if (!session.isValid()) {
        session = await refreshSession(session);
      }
      setSession(session);
    })();
  }, []);

  const isValid = !!session?.isValid();
  const userSub = session?.getIdToken().decodePayload().sub as undefined | string;
  return { isValid, userSub, session };
};

