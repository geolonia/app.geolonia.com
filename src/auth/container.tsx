import React, { useEffect } from 'react';

// i18n
import { loadLocale } from '../lib/load-locale';
import { setLocaleData } from '@wordpress/i18n';

// Utils
import estimateLanguage from '../lib/estimate-language';

// redux
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  getInTrouble,
  ready,
  setLoggedIn,
} from '../redux/actions/auth-support';

// Types
import Moment from 'moment';

import mixpanel from 'mixpanel-browser';
import { useGetUserQuery } from '../redux/apis/app-api';
import { useSession } from '../hooks/session';
import LoadingScreen from '../components/LoadingScreen';

const AuthContainer: React.FC<React.PropsWithChildren<{}>> = ({children}) => {
  const dispatch = useAppDispatch();
  const { isReady } = useAppSelector((state) => ({
    isReady: state.authSupport.isReady,
  }));
  const { userSub, session, isReady: isSessionReady } = useSession();
  const { data: user, isLoading } = useGetUserQuery({ userSub }, { skip: !userSub });

  useEffect(() => {
    (async () => {
      if (!isSessionReady || isLoading) {
        return;
      }

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
        if (!user) {
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
      } catch (error) {
        dispatch(getInTrouble());
        dispatch(setLoggedIn(false));
      } finally {
        dispatch(ready());
      }
    })();
  }, [dispatch, isSessionReady, session, isLoading, user]);

  if (!isReady) {
    return <LoadingScreen />;
  }
  return <>{children}</>;
};

export default AuthContainer;
