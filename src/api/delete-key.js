const URL_BASE = process.env.REACT_APP_USER_KEYS_API_URL;

export const deleteKey = token => userKey => {
  return fetch(`${URL_BASE}/${userKey}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "Application/json",
      Authorization: token
    }
  })
    .then(res => {
      if (res.ok && res.status < 400) {
        return res.json();
      } else {
        throw new Error("Request Error");
      }
    })
    .then(({ body }) => body);
};

export default deleteKey;
