export const isValidUsername = username => /^[a-zA-Z0-9-_]+$/.test(username);
export const isValidCode = code => /^[0-9]{6}$/.test(code);
export const isValidEmail = email => /^.+@.+$/.test(email); // TODO: willing to enhance
export const isValidPassword = password => password.length > 7;
