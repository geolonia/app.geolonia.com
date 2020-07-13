import { refreshSession } from "../auth";
import { CognitoUserSession } from "amazon-cognito-identity-js";

export const customFetch = async (
  session: Geolonia.Session,
  url: string,
  options: Parameters<typeof fetch>[1] = {}
): Promise<Response> => {
  if (!session) {
    return Promise.reject(new Error("no session found"));
  }
  let refreshedSession: CognitoUserSession;
  try {
    refreshedSession = await refreshSession(session);
  } catch (error) {
    return Promise.reject(error);
  }

  const idToken = refreshedSession.getIdToken().getJwtToken();
  const headers = (options && options.headers) || {};
  const fetchOptions = {
    ...options,
    headers: {
      ...headers,
      Authorization: idToken
    }
  };
  return fetch(url, fetchOptions);
};

export default customFetch;
