import ja from '../lang/ja.json';

export function loadLocale(lang: string) {
  if (lang === 'ja') {
    return ja.locale_data.messages;
  } else {
    return {};
  }
}
