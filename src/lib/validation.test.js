import {
  isValidUsername,
  isValidCode,
  isValidEmail,
  isValidPassword
} from "./validation";

describe("username validation", () => {
  it("should success", () => {
    const validUsername = "valid-user-name";
    expect(isValidUsername(validUsername)).toBeTruthy();
  });

  it("should fail", () => {
    const invalidUsername = "123@abc";
    expect(isValidUsername(invalidUsername)).toBeFalsy();
  });
});

describe("verification code validation", () => {
  it("should success", () => {
    const validVerificationCode = "123456";
    expect(isValidCode(validVerificationCode)).toBeTruthy();
  });

  it("should fail, case1", () => {
    const invalidVerificationCode = "123";
    expect(isValidCode(invalidVerificationCode)).toBeFalsy();
  });

  it("should fail, case2", () => {
    const invalidVerificationCode = "abc";
    expect(isValidCode(invalidVerificationCode)).toBeFalsy();
  });
});

describe("password validation", () => {
  it("should success", () => {
    const validPassword = "abcdabcd";
    expect(isValidPassword(validPassword)).toBeTruthy();
  });

  it("should fail", () => {
    const validPassword = "abc";
    expect(isValidPassword(validPassword)).toBeFalsy();
  });
});
