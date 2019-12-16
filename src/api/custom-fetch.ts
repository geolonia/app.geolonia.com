import { errorCodes, APIResult, Session } from "../types";
import { getErrorMessage } from "../constants";
const {
  REACT_APP_APP_API_BASE,
  REACT_APP_GEOSEARCH_API_BASE,
  REACT_APP_STAGE
} = process.env;

export const customFetch = <T>(
  session: Session,
  url: string,
  options: Parameters<typeof fetch>[1],
  {
    absPath,
    noAuth,
    decode,
    type
  }: {
    absPath?: boolean;
    noAuth?: boolean;
    decode?: "text" | "json";
    type?: "dashboard" | "geosearch";
  } = {}
): Promise<APIResult<T>> => {
  if (!session) {
    // session should be exists when call those API
    return Promise.resolve({
      error: true,
      code: errorCodes.UnAuthorized,
      message: getErrorMessage(errorCodes.UnAuthorized)
    });
  }

  let fetchOptions;
  const headers = (options && options.headers) || {};
  if (noAuth) {
    fetchOptions = { ...options, headers };
  } else {
    const idToken = session.getIdToken().getJwtToken();
    const headers = (options && options.headers) || {};
    fetchOptions = {
      ...options,
      headers: {
        ...headers,
        Authorization: idToken
      }
    };
  }

  const requestUrl = absPath
    ? url
    : type === "geosearch"
    ? `${REACT_APP_GEOSEARCH_API_BASE}/${REACT_APP_STAGE}${url}`
    : `${REACT_APP_APP_API_BASE}/${REACT_APP_STAGE}${url}`;

  return fetch(requestUrl, fetchOptions)
    .then<APIResult<T>>(res => {
      if (res.ok) {
        if (decode === "text") {
          return res.text().then((data: any) => ({ data, error: false }));
        } else {
          return res.json().then((data: T) => ({ data, error: false }));
        }
      } else if (res.status === 403) {
        return {
          error: true,
          code: errorCodes.UnAuthorized,
          message: getErrorMessage(errorCodes.UnAuthorized)
        };
      } else {
        return {
          error: true,
          code: errorCodes.Unknown,
          message: getErrorMessage(errorCodes.Unknown)
        };
      }
    })
    .catch<APIResult<T>>(error => {
      console.log(error);
      return {
        error: true,
        code: errorCodes.Network,
        message: getErrorMessage(errorCodes.Network)
      };
    });
};

export default customFetch;
