/**
 * Mapping for error code vs. description
 * @type {{[errorCode]: {[context]: string} | string}}
 */
const errorMessages = {
  NetworkError: "Something is wrong with your network.",
  InvalidParameterException: {
    signup:
      "Sign up parameter(s) seems to be missing or invalid. Please enter valid username, email address and password."
  },
  UsernameExistsException: "The username cannot be used.",
  UserLambdaValidationException: {
    signup: "The username cannot be used."
  },
  UserNotFoundException: {
    signin: "Incorrect username or password."
  },
  NotAuthorizedException: {
    signin: "Incorrect username or password."
  },
  default: "Unknown error occured."
};

const getErrorMessage = (error, context) => {
  let message = errorMessages[error.code];
  if (typeof message === "object" && !!context) {
    message = errorMessages[error.code][context];
  } else {
    message = errorMessages[error.code];
  }
  return message || error.message || errorMessages.default;
};

export default getErrorMessage;
