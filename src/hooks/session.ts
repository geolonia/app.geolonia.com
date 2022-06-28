import * as CognitoIdentity from 'amazon-cognito-identity-js';
import { useEffect, useState } from 'react';
import { getSession, refreshSession, signout } from '../auth';

export const useSession = () => {
  const [session, setSession] = useState<null | CognitoIdentity.CognitoUserSession >(null);
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        let session = await getSession();
        if (session === null) {
          setIsReady(true);
          return;
        } else if (!session.isValid()) {
          session = await refreshSession(session);
        }
        setSession(session);
        setIsReady(true);
      } catch (err: any) {
        if (err.code === 'NotAuthorizedException') {
          // something went wrong, sign out
          // likely that the refresh token expired
          await signout();
          document.location.reload();
        } else {
          throw err;
        }
      }
    })();
  }, []);

  const isValid = !!session?.isValid();
  const userSub = session?.getIdToken().decodePayload().sub as undefined | string;
  return { isValid, userSub, session, isReady };
};

