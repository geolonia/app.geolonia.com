import { isUsernameValid, isPasswordValid } from "./validators";

test("it should check username", () => {
  expect(isUsernameValid("aaaaAA")).toEqual(false);
});
test("it should check username", () => {
  expect(isUsernameValid("aaaabbbb")).toEqual(true);
});
test("it should check password", () => {
  expect(isPasswordValid("abc123ABC")).toEqual(true);
});
