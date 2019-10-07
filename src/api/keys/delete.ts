import AmazonCognitoIdentity from "amazon-cognito-identity-js";
const { REACT_APP_API_BASE } = process.env;

const deleteKey = (
  session: AmazonCognitoIdentity.CognitoUserSession | undefined,
  teamId: string,
  apiKey: string
) => {
  if (!session) {
    return Promise.reject(new Error("No session found."));
  }

  const idToken = session.getIdToken().getJwtToken();

  return fetch(`${REACT_APP_API_BASE}/teams/${teamId}/keys/${apiKey}`, {
    method: "DELETE",
    headers: {
      Authorization: idToken,
      "Content-Type": "application/json"
    }
  }).then(res => {
    if (res.ok) {
      return res.json();
    } else {
      console.error(res.json());
      throw new Error("network error");
    }
  });
};

export default deleteKey;
