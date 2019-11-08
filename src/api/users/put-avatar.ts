import { Session } from "../../types";
import fetch from "../custom-fetch";

const putAvatar = (session: Session, file: File) => {
  const userSub = session && session.getIdToken().decodePayload().sub;

  return fetch<{ links: { putAvatar: string } }>(
    session,
    `/users/${userSub}/avatar/links`,
    { method: "GET" }
  ).then(result => {
    if (result.error) {
      return Promise.resolve(result);
    } else {
      const signedURL = result.data.links.putAvatar;
      return fetch<any>(
        session,
        signedURL,
        {
          method: "PUT",
          headers: {
            "Content-Type": file.type
          },
          body: file
        },
        { absPath: true, noAuth: true, decode: "text" }
      );
    }
  });
};

export default putAvatar;
