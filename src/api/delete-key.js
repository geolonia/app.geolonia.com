const URL_BASE = __ENV__.USER_KEYS_API_URL;

export const deleteKey = token => userKey => {
  return fetch(`${URL_BASE}/${userKey}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "Application/json",
      Authorization: token
    }
  }).then(res => {
    if (res.ok) {
      return res.json();
    } else {
      throw new Error("Request Error");
    }
  });
};

export default deleteKey;
