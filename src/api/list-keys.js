const URL_BASE = process.env.REACT_APP_USER_KEYS_API_URL;

export const listKeys = (token) => () => {
  return fetch(URL_BASE, {
    method: 'GET',
    headers: {
      'Content-Type': 'Application/json',
      Authorization: token
    }
  })
    .then((res) => {
      if (res.ok && 400 > res.status) {
        return res.json();
      } else {
        throw new Error('Request Error');
      }
    })
    .then(({ body }) => body);
};

export default listKeys;
