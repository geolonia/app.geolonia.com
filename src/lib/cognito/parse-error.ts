import { __ } from "@wordpress/i18n";

export default (err: { code: string; message: string }): string => {
  const { code, message } = err;

  const PASSWORD_STRENGTH_ERROR = __("Insufficient password strength.");
  const USERNAME_DUPLICATION_ERROR = __(
    "Username exists already. You cannot use this username."
  );
  const EMAIL_DUPLICATION_ERROR = __(
    "The email exists already. You cannot use this mail address."
  );
  const CURRENTLY_NOT_ALLOWED_EMAIL = __(
    "The email is not currently allowed for private beta."
  );
  const RESERVED_USERNAME = __("You cannot use this username.");
  const INVALID_USERNAME = __(
    "Username should be less than 256 characters and include only lowercase characters(a-z), numbers(0-9), hyphen(-), underscore(_) and period(.)."
  );
  const UNHANDLED_PARAMETER_ERROR = __(
    "Invalid parameter specified. You cannot use this username or email."
  );
  const INVALID_EMAIL = __("Invalid email.");
  const SERVER_ERROR = __(
    "Oops, the server seems not to be responding correctly."
  );

  switch (code) {
    case "InvalidPasswordException": {
      return PASSWORD_STRENGTH_ERROR;
    }
    case "UsernameExistsException": {
      return USERNAME_DUPLICATION_ERROR;
    }
    case "UserLambdaValidationException": {
      if (message.indexOf("Currently not allowed email") > -1) {
        return CURRENTLY_NOT_ALLOWED_EMAIL;
      } else if (message.indexOf("Duplicate email") > -1) {
        return EMAIL_DUPLICATION_ERROR;
      } else if (message.indexOf("reserved username") > -1) {
        return RESERVED_USERNAME;
      } else if (message.indexOf("Invalid username") > -1) {
        return INVALID_USERNAME;
      } else {
        // NOTE: Unhandled case. This message should not be shown.
        // This will be a fallback with the Cognito Specification change
        return UNHANDLED_PARAMETER_ERROR;
      }
    }
    case "InvalidParameterException": {
      if (message.indexOf("Invalid email address format") > -1) {
        return INVALID_EMAIL;
      } else if (message.indexOf("Value at 'username'") > -1) {
        return INVALID_USERNAME;
      } else if (message.indexOf("Value at 'password'") > -1) {
        return PASSWORD_STRENGTH_ERROR;
      } else {
        // NOTE: Unhandled case. This message should not be shown.
        // This will be a fallback with the Cognito Specification change
        return UNHANDLED_PARAMETER_ERROR;
      }
    }
    case "UnexpectedLambdaException": {
      return SERVER_ERROR;
    }
    default: {
      return UNHANDLED_PARAMETER_ERROR;
    }
  }
};
