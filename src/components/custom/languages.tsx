import React from 'react';
import Link from '@material-ui/core/Link';
import estimateLanguage from '../../lib/estimate-language';
import { __ } from '@wordpress/i18n';
import queryString from 'query-string';

type LanguagesData = {
  [key: string]: { primitive: string; translated: string };
};
const Languages = () => {
  const hash = window.location.hash;
  const estimatedLanguage = estimateLanguage();

  const languages: LanguagesData = {
    ja: { primitive: '日本語', translated: __('Japanese') },
    en: { primitive: 'English', translated: __('English') },
  };

  // get url parameter
  let referrer = queryString.parse(window.location.search).referer;
  if (Array.isArray(referrer) || !referrer) {
    referrer = '';
  }
  const referrerQuery = referrer ? `&referrer=${referrer}` : '';

  // the selected language should lead the language list
  const sortedLanguagesKeys = Object.keys(languages);
  sortedLanguagesKeys.sort((langa) => (langa === estimatedLanguage ? -1 : 1));

  return (
    <div className="support-menu">
      <ul>
        {sortedLanguagesKeys.map((key) => {
          return (
            <li key={key}>
              {estimatedLanguage === key ? (
                <span>{languages[key].translated}</span>
              ) : (
                <Link
                  href={`/?lang=${key}${referrerQuery}${hash}`}
                  onClick={() => {
                    localStorage.setItem('geolonia__persisted_language', key);
                  }}
                >
                  {languages[key].primitive}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Languages;
