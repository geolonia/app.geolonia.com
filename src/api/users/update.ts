import AmazonCognitoIdentity from "amazon-cognito-identity-js";
import { UserMetaState } from "../../redux/actions/user-meta";
const { REACT_APP_API_BASE } = process.env;

const updateUser = (
  session: AmazonCognitoIdentity.CognitoUserSession,
  userMeta: UserMetaState
) => {
  const userSub = session.getIdToken().decodePayload().sub;
  const idToken = session.getIdToken().getJwtToken();

  return fetch(`${REACT_APP_API_BASE}/users/${userSub}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: idToken
    },
    body: JSON.stringify(userMeta)
    // TODO: handle 40x, 50x
  })
    .then((res: any) => res.text())
    .then(console.log);
};

export default updateUser;
