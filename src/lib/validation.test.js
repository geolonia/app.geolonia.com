import {
  isValidUsername,
  isValidCode,
  isValidEmail,
  isValidPassword
} from "./validation";

describe("username validation", () => {
  it("should success", () => {
    const validUsername = "valid-user-name";
    expect(isValidUsername(validUsername)).toBe(true);
  });

  it("should fail", () => {
    const invalidUsername = "123@abc";
    expect(isValidUsername(invalidUsername)).toBe(false);
  });
});

describe("verification code validation", () => {
  it("should success", () => {
    const validVerificationCode = "123456";
    expect(isValidCode(validVerificationCode)).toBe(true);
  });

  it("should fail, case1", () => {
    const invalidVerificationCode = "123";
    expect(isValidCode(invalidVerificationCode)).toBe(false);
  });

  it("should fail, case2", () => {
    const invalidVerificationCode = "abc";
    expect(isValidCode(invalidVerificationCode)).toBe(false);
  });
});

describe("email validation", () => {
  it("should success", () => {
    const validEmail = "hello@example.com";
    expect(isValidEmail(validEmail)).toBe(true);
  });

  it("should fail", () => {
    const invalidEmail = "hello";
    expect(isValidEmail(invalidEmail)).toBe(false);
  });
});

describe("password validation", () => {
  it("should success", () => {
    const validPassword = "abcdabcd";
    expect(isValidPassword(validPassword)).toBe(true);
  });

  it("should fail", () => {
    const validPassword = "abc";
    expect(isValidPassword(validPassword)).toBe(false);
  });
});
