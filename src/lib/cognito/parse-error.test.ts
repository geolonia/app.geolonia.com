import {
  parseSigninError,
  parseSignupError,
  parseVerifyError,
  parseForgotPasswordError,
  parseResetPasswordError,
  parseResendError,
  getDescriptions,
} from './parse-error';

// mock @wordpress/i18n to return the string as-is
jest.mock('@wordpress/i18n', () => ({
  __: (s: string) => s,
}));

const descriptions = getDescriptions();

describe('parseSigninError', () => {
  it('should return NO_AUTHORIZED for UserNotFoundException', () => {
    expect(
      parseSigninError({ code: 'UserNotFoundException', message: '' }),
    ).toBe(descriptions.NO_AUTHORIZED);
  });

  it('should return NO_AUTHORIZED for NotAuthorizedException', () => {
    expect(
      parseSigninError({ code: 'NotAuthorizedException', message: '' }),
    ).toBe(descriptions.NO_AUTHORIZED);
  });

  it('should return NOT_CONFIRMED for UserNotConfirmedException', () => {
    expect(
      parseSigninError({ code: 'UserNotConfirmedException', message: '' }),
    ).toBe(descriptions.NOT_CONFIRMED);
  });

  it('should return UNKNOWN for unrecognized error code', () => {
    expect(
      parseSigninError({ code: 'SomethingElse', message: '' }),
    ).toBe(descriptions.UNKNOWN);
  });

  it('should return UNHANDLED_PARAMETERS when error is undefined', () => {
    expect(parseSigninError(undefined)).toBe(
      descriptions.UNHANDLED_PARAMETERS,
    );
  });
});

describe('parseSignupError', () => {
  it('should return INSUFFICIENT_PASSWORD_STRENGTH for InvalidPasswordException', () => {
    expect(
      parseSignupError({ code: 'InvalidPasswordException', message: '' }),
    ).toBe(descriptions.INSUFFICIENT_PASSWORD_STRENGTH);
  });

  it('should return USERNAME_DUPLICATION for UsernameExistsException', () => {
    expect(
      parseSignupError({ code: 'UsernameExistsException', message: '' }),
    ).toBe(descriptions.USERNAME_DUPLICATION);
  });

  it('should return CURRENTLY_NOT_ALLOWED_EMAIL for UserLambdaValidationException with matching message', () => {
    expect(
      parseSignupError({
        code: 'UserLambdaValidationException',
        message: 'Currently not allowed email',
      }),
    ).toBe(descriptions.CURRENTLY_NOT_ALLOWED_EMAIL);
  });

  it('should return EMAIL_DUPLICATION for Duplicate email', () => {
    expect(
      parseSignupError({
        code: 'UserLambdaValidationException',
        message: 'Duplicate email found',
      }),
    ).toBe(descriptions.EMAIL_DUPLICATION);
  });

  it('should return RESERVED_USERNAME for reserved username', () => {
    expect(
      parseSignupError({
        code: 'UserLambdaValidationException',
        message: 'reserved username',
      }),
    ).toBe(descriptions.RESERVED_USERNAME);
  });

  it('should return INVALID_USERNAME for Invalid username', () => {
    expect(
      parseSignupError({
        code: 'UserLambdaValidationException',
        message: 'Invalid username',
      }),
    ).toBe(descriptions.INVALID_USERNAME);
  });

  it('should return UNHANDLED_PARAMETERS for unknown UserLambdaValidationException', () => {
    expect(
      parseSignupError({
        code: 'UserLambdaValidationException',
        message: 'something else',
      }),
    ).toBe(descriptions.UNHANDLED_PARAMETERS);
  });

  it('should return INVALID_EMAIL for InvalidParameterException with email format', () => {
    expect(
      parseSignupError({
        code: 'InvalidParameterException',
        message: 'Invalid email address format',
      }),
    ).toBe(descriptions.INVALID_EMAIL);
  });

  it('should return INVALID_USERNAME for InvalidParameterException with username', () => {
    expect(
      parseSignupError({
        code: 'InvalidParameterException',
        message: "Value at 'username' is bad",
      }),
    ).toBe(descriptions.INVALID_USERNAME);
  });

  it('should return INSUFFICIENT_PASSWORD_STRENGTH for InvalidParameterException with password', () => {
    expect(
      parseSignupError({
        code: 'InvalidParameterException',
        message: "Value at 'password' is bad",
      }),
    ).toBe(descriptions.INSUFFICIENT_PASSWORD_STRENGTH);
  });

  it('should return SERVER_TROUBLE for UnexpectedLambdaException', () => {
    expect(
      parseSignupError({ code: 'UnexpectedLambdaException', message: '' }),
    ).toBe(descriptions.SERVER_TROUBLE);
  });

  it('should return UNKNOWN when error is undefined', () => {
    expect(parseSignupError(undefined)).toBe(descriptions.UNKNOWN);
  });

  it('should return UNHANDLED_PARAMETERS for unknown error code', () => {
    expect(
      parseSignupError({ code: 'UnknownCode', message: '' }),
    ).toBe(descriptions.UNHANDLED_PARAMETERS);
  });
});

describe('parseVerifyError', () => {
  it('should return CODE_MISMATCH for CodeMismatchException', () => {
    expect(
      parseVerifyError({ code: 'CodeMismatchException', message: '' }),
    ).toBe(descriptions.CODE_MISMATCH);
  });

  it('should return EXPIRED_CODE for ExpiredCodeException', () => {
    expect(
      parseVerifyError({ code: 'ExpiredCodeException', message: '' }),
    ).toBe(descriptions.EXPIRED_CODE);
  });

  it('should return NO_SUCH_USER for UserNotFoundException', () => {
    expect(
      parseVerifyError({ code: 'UserNotFoundException', message: '' }),
    ).toBe(descriptions.NO_SUCH_USER);
  });

  it('should return ALREADY_CONFIRMED for NotAuthorizedException with CONFIRMED message', () => {
    expect(
      parseVerifyError({
        code: 'NotAuthorizedException',
        message: 'Current status is CONFIRMED',
      }),
    ).toBe(descriptions.ALREADY_CONFIRMED);
  });

  it('should return UNKNOWN for NotAuthorizedException without CONFIRMED', () => {
    expect(
      parseVerifyError({
        code: 'NotAuthorizedException',
        message: 'other reason',
      }),
    ).toBe(descriptions.UNKNOWN);
  });

  it('should return UNHANDLED_PARAMETERS_WITH_CODE when error is undefined', () => {
    expect(parseVerifyError(undefined)).toBe(
      descriptions.UNHANDLED_PARAMETERS_WITH_CODE,
    );
  });
});

describe('parseForgotPasswordError', () => {
  it('should return NO_SUCH_USER_OR_UNVERIFIED for UserNotFoundException', () => {
    expect(
      parseForgotPasswordError({ code: 'UserNotFoundException', message: '' }),
    ).toBe(descriptions.NO_SUCH_USER_OR_UNVERIFIED);
  });

  it('should return CANNOT_RESET_BEFORE_VERFIED for verified email error', () => {
    expect(
      parseForgotPasswordError({
        code: 'InvalidParameterException',
        message: 'no verified email',
      }),
    ).toBe(descriptions.CANNOT_RESET_BEFORE_VERFIED);
  });

  it('should return LIMIT_EXCEEDED for LimitExceededException', () => {
    expect(
      parseForgotPasswordError({ code: 'LimitExceededException', message: '' }),
    ).toBe(descriptions.LIMIT_EXCEEDED);
  });

  it('should return FAILED_TO_SEND_CODE when error is undefined', () => {
    expect(parseForgotPasswordError(undefined)).toBe(
      descriptions.FAILED_TO_SEND_CODE,
    );
  });

  it('should return FAILED_TO_SEND_CODE for unknown error', () => {
    expect(
      parseForgotPasswordError({ code: 'UnknownError', message: '' }),
    ).toBe(descriptions.FAILED_TO_SEND_CODE);
  });
});

describe('parseResetPasswordError', () => {
  it('should return INVALID_USERNAME for username InvalidParameterException', () => {
    expect(
      parseResetPasswordError({
        code: 'InvalidParameterException',
        message: "Value at 'username' is invalid",
      }),
    ).toBe(descriptions.INVALID_USERNAME);
  });

  it('should return INSUFFICIENT_PASSWORD_STRENGTH for password InvalidParameterException', () => {
    expect(
      parseResetPasswordError({
        code: 'InvalidParameterException',
        message: "Value at 'password' is invalid",
      }),
    ).toBe(descriptions.INSUFFICIENT_PASSWORD_STRENGTH);
  });

  it('should return CODE_MISMATCH for ExpiredCodeException', () => {
    expect(
      parseResetPasswordError({ code: 'ExpiredCodeException', message: '' }),
    ).toBe(descriptions.CODE_MISMATCH);
  });

  it('should return CODE_MISMATCH for CodeMismatchException', () => {
    expect(
      parseResetPasswordError({ code: 'CodeMismatchException', message: '' }),
    ).toBe(descriptions.CODE_MISMATCH);
  });

  it('should return LIMIT_EXCEEDED for LimitExceededException', () => {
    expect(
      parseResetPasswordError({ code: 'LimitExceededException', message: '' }),
    ).toBe(descriptions.LIMIT_EXCEEDED);
  });

  it('should return SERVER_TROUBLE for InvalidLambdaResponseException', () => {
    expect(
      parseResetPasswordError({
        code: 'InvalidLambdaResponseException',
        message: '',
      }),
    ).toBe(descriptions.SERVER_TROUBLE);
  });

  it('should return INSUFFICIENT_PASSWORD_STRENGTH for InvalidPasswordException', () => {
    expect(
      parseResetPasswordError({ code: 'InvalidPasswordException', message: '' }),
    ).toBe(descriptions.INSUFFICIENT_PASSWORD_STRENGTH);
  });

  it('should return UNKNOWN when error is undefined', () => {
    expect(parseResetPasswordError(undefined)).toBe(descriptions.UNKNOWN);
  });
});

describe('parseResendError', () => {
  it('should return NO_SUCH_USER for UserNotFoundException', () => {
    expect(
      parseResendError({ code: 'UserNotFoundException', message: '' }),
    ).toBe(descriptions.NO_SUCH_USER);
  });

  it('should return UNKNOWN for other errors', () => {
    expect(
      parseResendError({ code: 'SomethingElse', message: '' }),
    ).toBe(descriptions.UNKNOWN);
  });

  it('should return UNKNOWN when error is undefined', () => {
    expect(parseResendError(undefined)).toBe(descriptions.UNKNOWN);
  });
});
