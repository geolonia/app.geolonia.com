import ja from "../lang/ja.json";

export function loadLocale(lang: string) {
  if ("ja" === lang) {
    return ja.locale_data.messages;
  } else {
    return {};
  }
}
