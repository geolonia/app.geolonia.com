import { isUsernameValid, isEmailValid, isPasswordValid } from "./validation";

describe("username validation", () => {
  it("should success", () => {
    const validUsername = "valid-user-name";
    expect(isUsernameValid(validUsername)).toBeTruthy();
  });

  it("should fails", () => {
    const validUsername = "123@abc";
    expect(isUsernameValid(validUsername)).toBeFalsy();
  });
});
