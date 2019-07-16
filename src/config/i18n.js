import * as i18n from "@wordpress/i18n";
import languages from "../languages";
import qs from "querystring";

const search = window.location.search.replace(/^\?/, "");
const { locale = "ja" } = qs.parse(search);

i18n.setLocaleData(languages[locale], "geolonia-dashboard");
