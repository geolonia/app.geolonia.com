import { isUsernameValid, isEmailValid, isPasswordValid } from './validators';

describe('isUsernameValid', () => {
  it('should accept lowercase letters', () => {
    expect(isUsernameValid('testuser')).toBe(true);
  });

  it('should accept numbers', () => {
    expect(isUsernameValid('user123')).toBe(true);
  });

  it('should accept hyphens, underscores, and periods', () => {
    expect(isUsernameValid('test-user_name.1')).toBe(true);
  });

  it('should reject uppercase letters', () => {
    expect(isUsernameValid('aaaaAA')).toBe(false);
  });

  it('should reject spaces', () => {
    expect(isUsernameValid('test user')).toBe(false);
  });

  it('should reject empty string', () => {
    expect(isUsernameValid('')).toBe(false);
  });

  it('should reject username >= 256 characters', () => {
    expect(isUsernameValid('a'.repeat(256))).toBe(false);
  });

  it('should accept username of 255 characters', () => {
    expect(isUsernameValid('a'.repeat(255))).toBe(true);
  });

  it('should reject special characters like @', () => {
    expect(isUsernameValid('user@name')).toBe(false);
  });
});

describe('isEmailValid', () => {
  it('should accept standard email', () => {
    expect(isEmailValid('user@example.com')).toBe(true);
  });

  it('should accept email with subdomain', () => {
    expect(isEmailValid('user@mail.example.com')).toBe(true);
  });

  it('should accept email with special chars in local part', () => {
    expect(isEmailValid('user.name+tag@example.com')).toBe(true);
  });

  it('should reject email without @', () => {
    expect(isEmailValid('userexample.com')).toBe(false);
  });

  it('should reject email without domain', () => {
    expect(isEmailValid('user@')).toBe(false);
  });

  it('should reject empty string', () => {
    expect(isEmailValid('')).toBe(false);
  });
});

describe('isPasswordValid', () => {
  it('should accept password with lowercase, uppercase, and number', () => {
    expect(isPasswordValid('abc123ABC')).toBe(true);
  });

  it('should reject password shorter than 8 characters', () => {
    expect(isPasswordValid('aA1bbcc')).toBe(false);
  });

  it('should accept password of exactly 8 characters', () => {
    expect(isPasswordValid('aA1bccdd')).toBe(true);
  });

  it('should reject password without uppercase', () => {
    expect(isPasswordValid('abc12345')).toBe(false);
  });

  it('should reject password without lowercase', () => {
    expect(isPasswordValid('ABC12345')).toBe(false);
  });

  it('should reject password without number', () => {
    expect(isPasswordValid('abcABCde')).toBe(false);
  });

  it('should reject empty string', () => {
    expect(isPasswordValid('')).toBe(false);
  });
});
