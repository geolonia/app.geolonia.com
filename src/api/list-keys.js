const URL_BASE = __ENV__.USER_KEYS_API_URL;

export const listKeys = token => () => {
  return fetch(URL_BASE, {
    method: "GET",
    headers: {
      "Content-Type": "Application/json",
      Authorization: token
    }
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Request Error");
      }
    })
    .then(({ body }) => body);
};

export default listKeys;
