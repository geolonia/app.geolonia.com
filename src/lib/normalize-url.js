import url from "url";

export const normalizeURL = input => {
  let result;
  try {
    console.log(url.parse(input));
    const { protocol, hostname } = url.parse(input);

    if (!hostname) {
      result = false;
    } else {
      result = `${protocol || "https"}//${hostname}`;
    }
  } catch (e) {
    result = false;
  }

  return result;
};

export default normalizeURL;
