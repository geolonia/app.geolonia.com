import { __ } from "@wordpress/i18n";

/**
 * Mapping for error code vs. description
 * @type {{[errorCode]: {[context]: string} | string}}
 */
const errorMessages = {
  NetworkError: __(
    "Something is wrong with your network.",
    "geolonia-dashboard"
  ),
  InvalidParameterException: {
    signup: __(
      "Sign up parameter(s) seems to be missing or invalid. Please enter valid username, email address and password.",
      "geolonia-dashboard"
    )
  },
  UsernameExistsException: __(
    "The username cannot be used.",
    "geolonia-dashboard"
  ),
  UserLambdaValidationException: {
    signup: __("The username cannot be used.", "geolonia-dashboard")
  },
  UserNotFoundException: {
    signin: __("Incorrect username or password.", "geolonia-dashboard"),
    verify: __("Incorrect username.", "geolonia-dashboard")
  },
  NotAuthorizedException: {
    signin: __("Incorrect username or password.", "geolonia-dashboard")
  },
  CodeMismatchException: __("Invalid verification code.", "geolonia-dashboard"),
  default: __("Unknown error occured.", "geolonia-dashboard")
};

const getErrorMessage = (error, context) => {
  console.log(error);

  let message = errorMessages[error.code];
  if (typeof message === "object" && !!context) {
    message = errorMessages[error.code][context];
  } else {
    message = errorMessages[error.code];
  }
  return message || error.message || errorMessages.default;
};

export default getErrorMessage;
