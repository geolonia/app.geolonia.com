import ja from "../lang/ja.json"; // TODO: This is a mock up

export function loadLocale(lang: string) {
  console.log(lang)
  if ('ja' === lang) {
    return ja.locale_data.messages
  } else {
    return {}
  }
}
