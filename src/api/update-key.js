const URL_BASE = __ENV__.REACT_APP_USER_KEYS_API_URL

export const updateKey = token => (userKey, params) => {
  return fetch(`${URL_BASE}/${userKey}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'Application/json',
      Authorization: token
    },
    body: JSON.stringify(params)
  })
    .then(res => {
      if (res.ok) {
        return res.json()
      } else {
        throw new Error('Request Error')
      }
    })
    .then(({ body }) => body)
}

export default updateKey
