import { Session } from "../../types";
import fetch from "../custom-fetch";

const putAvatar = (session: Session, teamId: string, file: File) => {
  return fetch<{ links: { putAvatar: string } }>(
    session,
    `/teams/${teamId}/avatar/links`,
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
