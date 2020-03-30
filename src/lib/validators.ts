// NOTE: Cognito has looser rule
export const isUsernameValid = (username: string) =>
  username.length < 256 && /^[a-z0-9-_.]+$/.test(username);

export const isEmailValid = (email: string) =>
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
    email
  );

export const isPasswordValid = (password: string) => {
  if (password.length > 7) {
    const chars = password.split("");
    if (
      chars.some(char => /^[0-9]$/.test(char)) &&
      chars.some(char => /^[a-z]$/.test(char)) &&
      chars.some(char => /^[A-Z]$/.test(char))
    ) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};
