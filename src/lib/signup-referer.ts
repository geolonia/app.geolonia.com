import queryString from 'query-string';

const signupReferer = () => {

  let referrer = queryString.parse(window.location.search).referrer;

  if (Array.isArray(referrer) || !referrer) {
    referrer = '';
  }

  return referrer;
};

export default signupReferer;
