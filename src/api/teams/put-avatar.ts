import AmazonCognitoIdentity from "amazon-cognito-identity-js";
import { Team } from "../../redux/actions/team";
const { REACT_APP_API_BASE } = process.env;

const putAvatar = (
  session: AmazonCognitoIdentity.CognitoUserSession | undefined,
  teamId: string,
  file: File
) => {
  if (!session) {
    return Promise.reject(new Error("no session"));
  }

  const idToken = session.getIdToken().getJwtToken();

  return fetch(`${REACT_APP_API_BASE}/teams/${teamId}/avatar/links`, {
    method: "GET",
    headers: {
      Authorization: idToken
    }
  })
    .then(res => {
      if (res.ok) {
        return res.json().then(json => {
          const url = json.links.putAvatar;
          if (typeof url !== "string") {
            // Invalid server result
            throw new Error("network error");
          } else {
            return url;
          }
        }) as Promise<string>;
      } else {
        throw new Error("network error");
      }
    })
    .then(url => {
      return fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type
        },
        body: file
      });
    });
};

export default putAvatar;