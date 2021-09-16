import React, { useEffect, useMemo } from 'react';

// i18n
import { I18nProvider } from '@wordpress/react-i18n';
import { loadLocale } from '../lib/load-locale';
import { createI18n, setLocaleData } from '@wordpress/i18n';

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
  const { isReady, language } = useAppSelector((state) => ({
    isReady: state.authSupport.isReady,
    language: state.userMeta.language,
  }));
  const i18n = useMemo(() => {
    return createI18n(loadLocale(language));
  }, [language]);

  useEffect(() => {
    (async () => {
      const session = await getSession();

      if (session === null) {
        // TODO: Remove this after all translation calls are migrated to the useI18n() hook.
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

        // TODO: Remove this after all translation calls are migrated to the useI18n() hook.
        // START
        const localeData = loadLocale(language);
        if (localeData) {
          setLocaleData(localeData);
        }
        // END

        // NOTE: Can we make a moment vending machine? Or switch to something that isn't moment to save on bundle size?
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
  }, [dispatch, i18n]);

  return <I18nProvider i18n={i18n}>
    {isReady && children}
  </I18nProvider>;
};

export default AuthContainer;
