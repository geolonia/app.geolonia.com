import AmazonCognitoIdentity from "amazon-cognito-identity-js";
const { REACT_APP_API_BASE } = process.env;

const updateAvatar = (
  base64Image: string,
  session: AmazonCognitoIdentity.CognitoUserSession
) => {
  const userSub = session.getAccessToken().decodePayload().sub;
  const accessToken = session.getAccessToken().getJwtToken();
  return fetch(`${REACT_APP_API_BASE}/users/${userSub}/avatar`, {
    method: "PUT",
    headers: {
      Authorization: `bearer ${accessToken}`,
      ContentType: "application/octed-stream"
    },
    body: base64Image
  })
    .then((res: any) => res.json())
    .then(({ avatarUrl }: any) => avatarUrl as string);
};

export default updateAvatar;
