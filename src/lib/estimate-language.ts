import queryString from "query-string";

const estimateLanguage = () => {
  // URL で明示される言語を優先
  const parsed = queryString.parse(window.location.search);
  const qsLang =
    parsed && typeof parsed.lang === "string" ? parsed.lang : void 0;
  if (qsLang) {
    return qsLang;
  }

  // 次にローカルストレージに格納された暗黙の言語（ログアウトする前に使っていた言語）を優先
  const persistedLang = localStorage.getItem("geolonia__persisted_language");
  if (persistedLang) {
    return persistedLang;
  }

  // 最後にブラウザの言語を優先
  const browserLang = navigator.language.slice(0, 2) === "ja" ? "ja" : "en";
  return browserLang;
};

export default estimateLanguage
