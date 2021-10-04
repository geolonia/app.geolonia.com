import React, { useEffect } from 'react';

// i18n
import { loadLocale } from '../lib/load-locale';
import { setLocaleData } from '@wordpress/i18n';

// API
import { getSession } from './';
import getUser from '../api/users/get';

// Utils
import estimateLanguage from '../lib/estimate-language';

// redux
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  getInTrouble,
  ready,
  setLoggedIn,
} from '../redux/actions/auth-support';
import {
  set as setUserMeta,
  isUserMeta,
} from '../redux/actions/user-meta';

// Types
import Moment from 'moment';

import mixpanel from 'mixpanel-browser';

const AuthContainer: React.FC = ({children}) => {
  const dispatch = useAppDispatch();
  const { isReady } = useAppSelector((state) => ({
    isReady: state.authSupport.isReady,
  }));

  useEffect(() => {
    (async () => {
      // TODO: replace with useSession
      const session = await getSession();

      if (session === null) {
        setLocaleData(loadLocale(estimateLanguage()));
        dispatch(setLoggedIn(false));
        dispatch(ready());
        return;
      }

      const idTokenPayload = session.getIdToken().payload;
      mixpanel.identify(idTokenPayload.sub);
      mixpanel.alias(idTokenPayload['cognito:username']);
      mixpanel.people.set('$name', idTokenPayload['cognito:username']);
      mixpanel.people.set('$email', idTokenPayload.email);

      try {
        // TODO: replace with useUser
        const userResp = await getUser(session);
        const user = userResp.error ? undefined : { ...userResp.data.item, links: userResp.data.links };
        if (!isUserMeta(user)) {
          throw new Error('invalid user meta response');
        }

        const { language, timezone } = user;
        // ログイン時に毎回ユーザーの言語をローカルストレージに保存しておく。
        // ログアウトしたときの多言語化で使うため
        if (language) {
          localStorage.setItem('geolonia__persisted_language', language);
        }

        const localeData = loadLocale(language);
        if (localeData) {
          setLocaleData(localeData);
        }
        Moment.locale(language);
        Moment.tz.setDefault(timezone);
        // NOTE: We can localize datetime format here
        Moment.defaultFormat = 'YYYY-MM-DD HH:mm:ss';

        dispatch(setLoggedIn(true));
        dispatch(setUserMeta(user));
      } catch (error) {
        dispatch(getInTrouble());
        dispatch(setLoggedIn(false));
      } finally {
        dispatch(ready());
      }
    })();
  }, [dispatch]);

  return <>{isReady && children}</>;
};

export default AuthContainer;
