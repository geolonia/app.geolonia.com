import { __ } from '@wordpress/i18n';

type CognitoErrorParser = (
  error: { code: string; message: string } | void
) => string;

/**
 * get i18nized error descriptions
 */
export const getDescriptions = () => ({
  INSUFFICIENT_PASSWORD_STRENGTH: __('Insufficient password strength.'),
  USERNAME_DUPLICATION: __(
    'Username exists already. You cannot use this username.',
  ),
  EMAIL_DUPLICATION: __(
    'The email exists already. You cannot use this mail address.',
  ),
  CURRENTLY_NOT_ALLOWED_EMAIL: __(
    'The email is not currently allowed for private beta.',
  ),
  NO_AUTHORIZED: __('Incorrect username, email address or password.'),
  RESERVED_USERNAME: __('You cannot use this username.'),
  INVALID_USERNAME: __(
    'Username should be less than 256 characters and include only lowercase characters(a-z), numbers(0-9), hyphen(-), underscore(_) and period(.).',
  ),
  UNHANDLED_PARAMETERS: __(
    'Invalid parameter specified. You cannot use this username or email.',
  ),
  UNHANDLED_PARAMETERS_WITH_CODE: __(
    'Invalid parameter specified. You cannot use this username, email, or verification code.',
  ),
  CANNOT_RESET_BEFORE_VERFIED: __(
    'Cannot reset password for the user as there is no verified email.',
  ),
  ALREADY_CONFIRMED: __(
    'User is already verified. Please <a class="MuiTypography-root MuiLink-root MuiLink-underlineHover MuiTypography-colorPrimary" href="#/signin">signin</a>.',
  ),
  NOT_CONFIRMED: __(
    'User is not verified. Please <a class="MuiTypography-root MuiLink-root MuiLink-underlineHover MuiTypography-colorPrimary" href="#/resend">verify</a> your account.',
  ),
  LIMIT_EXCEEDED: __('Attempt limit exceeded, please try after some time.'),
  INVALID_EMAIL: __('Invalid email.'),
  CODE_MISMATCH: __('Verification code mismatch.'),
  EXPIRED_CODE: __('Invalid code provided, please request a code again.'),
  FAILED_TO_SEND_CODE: __('Unknown error. Failed to send a verification code.'),
  NO_SUCH_USER: __('User not found. Please check entered username.'),
  NO_SUCH_USER_OR_UNVERIFIED: __(
    'User not found. Please check entered username or email. If you use email, perhaps the email is not verified.',
  ),
  SERVER_TROUBLE: __('Oops, the server seems not to be responding correctly.'),
  UNKNOWN: __('Unknown error.'),
});

export const parseSigninError: CognitoErrorParser = (err) => {
  const descriptions = getDescriptions();
  if (!err) {
    return descriptions.UNHANDLED_PARAMETERS;
  } else if (
    err.code === 'UserNotFoundException' ||
    err.code === 'NotAuthorizedException'
  ) {
    return descriptions.NO_AUTHORIZED;
  } else if (err.code === 'UserNotConfirmedException') {
    return descriptions.NOT_CONFIRMED;
  } else {
    return descriptions.UNKNOWN;
  }
};

export const parseSignupError: CognitoErrorParser = (err) => {
  const descriptions = getDescriptions();
  if (!err) {
    return descriptions.UNKNOWN;
  }
  const { code, message } = err;

  switch (code) {
    case 'InvalidPasswordException': {
      return descriptions.INSUFFICIENT_PASSWORD_STRENGTH;
    }
    case 'UsernameExistsException': {
      return descriptions.USERNAME_DUPLICATION;
    }
    case 'UserLambdaValidationException': {
      if (message.indexOf('Currently not allowed email') > -1) {
        return descriptions.CURRENTLY_NOT_ALLOWED_EMAIL;
      } else if (message.indexOf('Duplicate email') > -1) {
        return descriptions.EMAIL_DUPLICATION;
      } else if (message.indexOf('reserved username') > -1) {
        return descriptions.RESERVED_USERNAME;
      } else if (message.indexOf('Invalid username') > -1) {
        return descriptions.INVALID_USERNAME;
      } else {
        // NOTE: Unhandled case. This message should not be shown.
        // This will be a fallback with the Cognito Specification change
        return descriptions.UNHANDLED_PARAMETERS;
      }
    }
    case 'InvalidParameterException': {
      if (message.indexOf('Invalid email address format') > -1) {
        return descriptions.INVALID_EMAIL;
      } else if (message.indexOf('Value at \'username\'') > -1) {
        return descriptions.INVALID_USERNAME;
      } else if (message.indexOf('Value at \'password\'') > -1) {
        return descriptions.INSUFFICIENT_PASSWORD_STRENGTH;
      } else {
        // NOTE: Unhandled case. This message should not be shown.
        // This will be a fallback with the Cognito Specification change
        return descriptions.UNHANDLED_PARAMETERS;
      }
    }
    case 'UnexpectedLambdaException': {
      return descriptions.SERVER_TROUBLE;
    }
    default: {
      // NOTE: Unhandled case. This message should not be shown.
      return descriptions.UNHANDLED_PARAMETERS;
    }
  }
};

export const parseVerifyError: CognitoErrorParser = (err) => {
  const descriptions = getDescriptions();
  if (!err) {
    // NOTE: Unhandled case. This message should not be shown.
    return descriptions.UNHANDLED_PARAMETERS_WITH_CODE;
  }
  if (err.code === 'CodeMismatchException') {
    return descriptions.CODE_MISMATCH;
  } else if (err.code === 'ExpiredCodeException') {
    return descriptions.EXPIRED_CODE;
  } else if (err.code === 'UserNotFoundException') {
    return descriptions.NO_SUCH_USER;
  } else if (err.code === 'NotAuthorizedException') {
    if (err.message.indexOf('Current status is CONFIRMED') > -1) {
      return descriptions.ALREADY_CONFIRMED;
    } else {
      return descriptions.UNKNOWN;
    }
  } else {
    // NOTE: Unhandled case. This message should not be shown.
    return descriptions.UNHANDLED_PARAMETERS_WITH_CODE;
  }
};

export const parseForgotPasswordError: CognitoErrorParser = (err) => {
  const descriptions = getDescriptions();

  if (!err) {
    return descriptions.FAILED_TO_SEND_CODE;
  }

  if (err.code === 'UserNotFoundException') {
    // unconfirmed の時はこれが帰ってくる
    return descriptions.NO_SUCH_USER_OR_UNVERIFIED;
  } else if (err.code === 'InvalidParameterException') {
    if (err.message.indexOf('verified email') > -1) {
      return descriptions.CANNOT_RESET_BEFORE_VERFIED;
    } else {
      return descriptions.FAILED_TO_SEND_CODE;
    }
  } else if (err.code === 'LimitExceededException') {
    return descriptions.LIMIT_EXCEEDED;
  } else {
    return descriptions.FAILED_TO_SEND_CODE;
  }
};

export const parseResetPasswordError: CognitoErrorParser = (err) => {
  const descriptions = getDescriptions();

  if (!err) {
    return descriptions.UNKNOWN;
  }
  const { code, message } = err;
  if (code === 'InvalidParameterException') {
    if (message.indexOf('Value at \'username\'') > -1) {
      return descriptions.INVALID_USERNAME;
    } else if (message.indexOf('Value at \'password\'') > -1) {
      return descriptions.INSUFFICIENT_PASSWORD_STRENGTH;
    } else {
      // NOTE: Unhandled case. This message should not be shown.
      // This will be a fallback with the Cognito Specification change
      return descriptions.UNHANDLED_PARAMETERS;
    }
  } else if (err.code === 'ExpiredCodeException') {
    // NOTE: Cognito は、reset password のリクエストの際に変なコード(aaa など)を送るとこのエラーを返してくる
    // また、コードを発行していないユーザー名を指定してもこのエラーを返す
    // 実態はコードのミスマッチなので、そのエラーメッセージを表示している
    return descriptions.CODE_MISMATCH;
  } else if (err.code === 'LimitExceededException') {
    return descriptions.LIMIT_EXCEEDED;
  } else if (err.code === 'InvalidLambdaResponseException') {
    return descriptions.SERVER_TROUBLE;
  } else if (err.code === 'InvalidPasswordException') {
    return descriptions.INSUFFICIENT_PASSWORD_STRENGTH;
  } else if(err.code === 'CodeMismatchException') {
    return descriptions.CODE_MISMATCH;
  } else {
    // NOTE: Unhandled case. This message should not be shown.
    // This will be a fallback with the Cognito Specification change
    return descriptions.LIMIT_EXCEEDED;
  }
};

export const parseResendError: CognitoErrorParser = (err) => {
  const descriptions = getDescriptions();

  if (!err) {
    return descriptions.UNKNOWN;
  }
  if (err.code === 'UserNotFoundException') {
    return descriptions.NO_SUCH_USER;
  } else {
    return descriptions.UNKNOWN;
  }
};
