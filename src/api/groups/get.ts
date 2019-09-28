import AmazonCognitoIdentity from "amazon-cognito-identity-js";
const { REACT_APP_API_BASE } = process.env;

const getGroups = (session: AmazonCognitoIdentity.CognitoUserSession) => {
  const userSub = session.getIdToken().decodePayload().sub;
  const idToken = session.getIdToken().getJwtToken();

  // NOTE: API 側では belonging を取得する
  return fetch(`${REACT_APP_API_BASE}/users/${userSub}/groups`, {
    method: "GET",
    headers: {
      Authorization: idToken
    }
    // TODO: handle 40x, 50x
  })
    .then((res: any) => res.json())
    .catch(() => [
      {
        groupSub: "hhhhaaaasssshhhh123-0",
        name: "default(username) - mock",
        isDefault: true
      },
      {
        groupSub: "hhhhaaaasssshhhh123-1",
        name: "group 1"
      },
      {
        groupSub: "hhhhaaaasssshhhh123-2",
        name: "group 2"
      }
    ]);
};

export default getGroups;
