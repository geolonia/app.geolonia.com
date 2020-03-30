import queryString from "query-string";

export default () => {
  const browserLanguage = navigator.language.slice(0, 2) === "ja" ? "ja" : "en";
  const parsed = queryString.parse(window.location.search);
  const urlLanguage =
    parsed && typeof parsed.lang === "string" ? parsed.lang : void 0;
  return urlLanguage || browserLanguage;
};
