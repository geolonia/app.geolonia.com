import { getErrorMessage } from "../constants";
import { refreshSession } from "../auth";
import { CognitoUserSession } from "amazon-cognito-identity-js";
import { errorCodes } from "../constants";
const { REACT_APP_APP_API_BASE, REACT_APP_STAGE } = process.env;

export const customFetch = async <T>(
  session: Geolonia.Session,
  url: string,
  options: Parameters<typeof fetch>[1],
  {
    absPath,
    noAuth,
    decode
  }: {
    absPath?: boolean;
    noAuth?: boolean;
    decode?: "text" | "json";
  } = {}
): Promise<Geolonia.APIResult<T>> => {
  if (!session) {
    // session should be exists when call those API
    return {
      error: true,
      code: errorCodes.UnAuthorized,
      message: getErrorMessage(errorCodes.UnAuthorized)
    }
  }

  const refreshedSession: CognitoUserSession = await refreshSession(session);

  let fetchOptions;
  const headers = (options && options.headers) || {};
  if (noAuth) {
    fetchOptions = { ...options, headers };
  } else {
    const idToken = refreshedSession.getIdToken().getJwtToken();
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
    : `${REACT_APP_APP_API_BASE}/${REACT_APP_STAGE}${url}`;

  return fetch(requestUrl, fetchOptions)
    .then<Geolonia.APIResult<T>>(res => {
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
    .catch<Geolonia.APIResult<T>>(error => {
      return {
        error: true,
        code: errorCodes.Network,
        message: getErrorMessage(errorCodes.Network)
      };
    });
};

export default customFetch;
