import queryString from "query-string";

export default () => {
  const parsed = queryString.parse(window.location.search);
  const qsLang =
    parsed && typeof parsed.lang === "string" ? parsed.lang : void 0;
  if (qsLang) {
    return qsLang;
  }

  const persistedLang = localStorage.getItem("geolonia__persisted_language");
  if (persistedLang) {
    return persistedLang;
  }

  const browserLang = navigator.language.slice(0, 2) === "ja" ? "ja" : "en";
  return browserLang;
};
