/**
 * amazon-cognito-identity-js との境界を固定するテスト。
 *
 * src/auth/index.ts はコールバック形式の Cognito API を Promise でラップしている。
 * ライブラリを更新したときに、どの API がどの引数で呼ばれるか、成功と失敗が
 * どちらに分岐するかが変わっていないことを、ここで検出する。
 */

jest.mock('isomorphic-fetch', () => ({}));

jest.mock('mixpanel-browser', () => ({
  reset: jest.fn(),
}));

jest.mock('../lib/estimate-language', () => ({
  __esModule: true,
  default: jest.fn(() => 'ja'),
}));

jest.mock('../lib/signup-referrer', () => ({
  __esModule: true,
  default: jest.fn(() => 'test-referrer'),
}));

// インスタンスをファクトリの中で作り、__mocks 経由で取り出す。
// ファクトリの外の変数を参照すると、モジュール読み込み順の都合で TDZ に当たる。
jest.mock('amazon-cognito-identity-js', () => {
  const userPool = {
    signUp: jest.fn(),
    getCurrentUser: jest.fn(),
  };
  const cognitoUser = {
    authenticateUser: jest.fn(),
    changePassword: jest.fn(),
    confirmPassword: jest.fn(),
    confirmRegistration: jest.fn(),
    forgotPassword: jest.fn(),
    getSession: jest.fn(),
    getUsername: jest.fn(),
    refreshSession: jest.fn(),
    resendConfirmationCode: jest.fn(),
    signOut: jest.fn(),
    updateAttributes: jest.fn(),
  };
  return {
    __esModule: true,
    CognitoUserPool: jest.fn(() => userPool),
    CognitoUser: jest.fn(() => cognitoUser),
    CognitoUserAttribute: jest.fn((data: unknown) => ({ ...(data as object) })),
    AuthenticationDetails: jest.fn((data: unknown) => ({ ...(data as object) })),
    __mocks: { userPool, cognitoUser },
  };
});

import * as CognitoIdentity from 'amazon-cognito-identity-js';
import * as mixpanel from 'mixpanel-browser';
import * as auth from './index';

const { userPool, cognitoUser } = (
  jest.requireMock('amazon-cognito-identity-js') as {
    __mocks: {
      userPool: Record<string, jest.Mock>;
      cognitoUser: Record<string, jest.Mock>;
    };
  }
).__mocks;

const CognitoUserPoolMock = CognitoIdentity.CognitoUserPool as unknown as jest.Mock;
const CognitoUserMock = CognitoIdentity.CognitoUser as unknown as jest.Mock;
const CognitoUserAttributeMock =
  CognitoIdentity.CognitoUserAttribute as unknown as jest.Mock;
const AuthenticationDetailsMock =
  CognitoIdentity.AuthenticationDetails as unknown as jest.Mock;

/** getIdToken().getJwtToken() を持つ、authenticateUser の成功結果 */
const buildAuthResult = (jwt: string) => ({
  getIdToken: () => ({ getJwtToken: () => jwt }),
});

/** isValid() と getRefreshToken() を持つセッション */
const buildSession = (isValid: boolean, refreshToken: unknown = 'refresh-token') => ({
  isValid: jest.fn(() => isValid),
  getRefreshToken: jest.fn(() => refreshToken),
});

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

describe('userPool', () => {
  it('モジュール読み込み時に CognitoUserPool を1度だけ生成する', () => {
    // 生成はモジュール読み込み時なので呼び出し回数は数えず、公開されている
    // インスタンスがモックのものと同一であることを確認する
    expect(auth.userPool).toBe(userPool);
  });
});

describe('signUp', () => {
  it('email / locale / custom:signup_tag を属性に載せて signUp を呼ぶ', async () => {
    const result = { user: {}, userConfirmed: false };
    userPool.signUp.mockImplementation((_u, _p, _attrs, _v, cb) => cb(null, result));

    await expect(auth.signUp('testuser', 'a@example.com', 'pw')).resolves.toBe(result);

    expect(userPool.signUp).toHaveBeenCalledTimes(1);
    const [username, password, attributeList, validationData] =
      userPool.signUp.mock.calls[0];
    expect(username).toBe('testuser');
    expect(password).toBe('pw');
    expect(validationData).toEqual([]);
    expect(attributeList).toHaveLength(3);
    expect(CognitoUserAttributeMock.mock.calls.map(([arg]) => arg)).toEqual([
      { Name: 'email', Value: 'a@example.com' },
      { Name: 'locale', Value: 'ja' },
      { Name: 'custom:signup_tag', Value: 'test-referrer' },
    ]);
  });

  it('エラーが返ったら reject する', async () => {
    const err = new Error('signUp failed');
    userPool.signUp.mockImplementation((_u, _p, _attrs, _v, cb) => cb(err, undefined));

    await expect(auth.signUp('testuser', 'a@example.com', 'pw')).rejects.toBe(err);
  });

  it('エラーが無くても result が無ければ reject する', async () => {
    userPool.signUp.mockImplementation((_u, _p, _attrs, _v, cb) => cb(null, undefined));

    // reject の引数は err をそのまま渡すため、この経路では falsy な値になる。
    // 呼び出し側の catch には null が渡る。
    await expect(auth.signUp('testuser', 'a@example.com', 'pw')).rejects.toBeNull();
  });
});

describe('requestVerificationCode', () => {
  it('resendConfirmationCode が成功したら true で resolve する', async () => {
    cognitoUser.resendConfirmationCode.mockImplementation((cb) => cb(null));

    await expect(auth.requestVerificationCode('testuser')).resolves.toBe(true);

    expect(CognitoUserMock).toHaveBeenCalledWith({
      Username: 'testuser',
      Pool: userPool,
    });
  });

  it('この関数だけ独自に CognitoUserPool を生成する', async () => {
    cognitoUser.resendConfirmationCode.mockImplementation((cb) => cb(null));

    await auth.requestVerificationCode('testuser');

    // モジュール読み込み時とは別に、呼び出しごとに1つ生成される
    expect(CognitoUserPoolMock).toHaveBeenCalledTimes(1);
  });

  it('エラーが返ったら reject する', async () => {
    const err = new Error('resend failed');
    cognitoUser.resendConfirmationCode.mockImplementation((cb) => cb(err));

    await expect(auth.requestVerificationCode('testuser')).rejects.toBe(err);
  });
});

describe('verify', () => {
  it('confirmRegistration を forceAliasCreation 付きで呼ぶ', async () => {
    cognitoUser.confirmRegistration.mockImplementation((_code, _force, cb) =>
      cb(null, 'SUCCESS'),
    );

    await expect(auth.verify('testuser', '123456')).resolves.toBe('SUCCESS');

    expect(cognitoUser.confirmRegistration).toHaveBeenCalledWith(
      '123456',
      true,
      expect.any(Function),
    );
  });

  it('エラーが返ったら reject する', async () => {
    const err = new Error('verify failed');
    cognitoUser.confirmRegistration.mockImplementation((_code, _force, cb) => cb(err));

    await expect(auth.verify('testuser', '123456')).rejects.toBe(err);
  });
});

describe('signin', () => {
  it('認証成功後にセッションを取得し、idToken の JWT を accessToken として返す', async () => {
    const session = buildSession(true);
    cognitoUser.authenticateUser.mockImplementation((_details, callbacks) =>
      callbacks.onSuccess(buildAuthResult('jwt-token')),
    );
    cognitoUser.getSession.mockImplementation((cb) => cb(null, session));

    await expect(auth.signin('testuser', 'pw')).resolves.toEqual({
      cognitoUser,
      session,
      accessToken: 'jwt-token',
    });

    expect(AuthenticationDetailsMock).toHaveBeenCalledWith({
      Username: 'testuser',
      Password: 'pw',
    });
  });

  it('認証に失敗したら reject する', async () => {
    const err = new Error('auth failed');
    cognitoUser.authenticateUser.mockImplementation((_details, callbacks) =>
      callbacks.onFailure(err),
    );

    await expect(auth.signin('testuser', 'pw')).rejects.toBe(err);
    expect(cognitoUser.getSession).not.toHaveBeenCalled();
  });

  it('認証は通ってもセッション取得に失敗したら reject する', async () => {
    const err = new Error('session failed');
    cognitoUser.authenticateUser.mockImplementation((_details, callbacks) =>
      callbacks.onSuccess(buildAuthResult('jwt-token')),
    );
    cognitoUser.getSession.mockImplementation((cb) => cb(err, null));

    await expect(auth.signin('testuser', 'pw')).rejects.toBe(err);
  });
});

describe('getSession', () => {
  it('ログインユーザーがいなければ null で resolve する', async () => {
    userPool.getCurrentUser.mockReturnValue(null);

    await expect(auth.getSession()).resolves.toBeNull();
  });

  it('セッションを取得できたら resolve し、currentSession に保持する', async () => {
    const session = buildSession(true);
    userPool.getCurrentUser.mockReturnValue(cognitoUser);
    cognitoUser.getSession.mockImplementation((cb) => cb(null, session));

    await expect(auth.getSession()).resolves.toBe(session);
    expect(auth.currentSession).toBe(session);
  });

  it('セッション取得に失敗したら signOut したうえで reject する', async () => {
    const err = new Error('no session');
    userPool.getCurrentUser.mockReturnValue(cognitoUser);
    cognitoUser.getSession.mockImplementation((cb) => cb(err, null));

    await expect(auth.getSession()).rejects.toBe(err);
    expect(cognitoUser.signOut).toHaveBeenCalledTimes(1);
  });

  it('エラーが無くてもセッションが無ければ signOut して reject する', async () => {
    userPool.getCurrentUser.mockReturnValue(cognitoUser);
    cognitoUser.getSession.mockImplementation((cb) => cb(null, null));

    await expect(auth.getSession()).rejects.toBeNull();
    expect(cognitoUser.signOut).toHaveBeenCalledTimes(1);
  });
});

describe('refreshSession', () => {
  it('ログインユーザーがいなければ no session found で reject する', async () => {
    userPool.getCurrentUser.mockReturnValue(null);

    await expect(auth.refreshSession(buildSession(false) as never)).rejects.toThrow(
      'no session found',
    );
  });

  it('セッションが有効なら refreshSession を呼ばずにそのまま返す', async () => {
    const session = buildSession(true);
    userPool.getCurrentUser.mockReturnValue(cognitoUser);

    await expect(auth.refreshSession(session as never)).resolves.toBe(session);
    expect(cognitoUser.refreshSession).not.toHaveBeenCalled();
  });

  it('セッションが無効ならリフレッシュトークンを渡して更新する', async () => {
    const session = buildSession(false, 'the-refresh-token');
    const refreshed = buildSession(true);
    userPool.getCurrentUser.mockReturnValue(cognitoUser);
    cognitoUser.refreshSession.mockImplementation((_token, cb) => cb(null, refreshed));

    await expect(auth.refreshSession(session as never)).resolves.toBe(refreshed);

    expect(cognitoUser.refreshSession).toHaveBeenCalledWith(
      'the-refresh-token',
      expect.any(Function),
    );
    expect(auth.currentSession).toBe(refreshed);
  });

  it('更新に失敗したら signOut したうえで reject する', async () => {
    const err = new Error('refresh failed');
    const session = buildSession(false);
    userPool.getCurrentUser.mockReturnValue(cognitoUser);
    cognitoUser.refreshSession.mockImplementation((_token, cb) => cb(err));

    await expect(auth.refreshSession(session as never)).rejects.toBe(err);
    expect(cognitoUser.signOut).toHaveBeenCalledTimes(1);
  });
});

describe('signout', () => {
  it('signOut と mixpanel.reset を呼ぶ', async () => {
    userPool.getCurrentUser.mockReturnValue(cognitoUser);

    await auth.signout();

    expect(cognitoUser.signOut).toHaveBeenCalledTimes(1);
    expect(mixpanel.reset).toHaveBeenCalledTimes(1);
  });

  it('ログインユーザーがいなくても resolve する', async () => {
    userPool.getCurrentUser.mockReturnValue(null);

    await expect(auth.signout()).resolves.toBeUndefined();
    expect(cognitoUser.signOut).not.toHaveBeenCalled();
  });

  it('geolonia__persisted で始まるキーだけを残して localStorage を消す', async () => {
    userPool.getCurrentUser.mockReturnValue(null);
    localStorage.setItem('geolonia__persisted_language', 'ja');
    localStorage.setItem('geolonia__persisted_other', 'kept');
    localStorage.setItem('some_token', 'removed');

    await auth.signout();

    expect(localStorage.getItem('geolonia__persisted_language')).toBe('ja');
    expect(localStorage.getItem('geolonia__persisted_other')).toBe('kept');
    expect(localStorage.getItem('some_token')).toBeNull();
  });
});

describe('sendVerificationEmail', () => {
  it('forgotPassword が成功したら true で resolve する', async () => {
    cognitoUser.forgotPassword.mockImplementation((callbacks) => callbacks.onSuccess());

    await expect(auth.sendVerificationEmail('testuser')).resolves.toBe(true);
  });

  it('forgotPassword が失敗したら reject する', async () => {
    const err = new Error('forgot failed');
    cognitoUser.forgotPassword.mockImplementation((callbacks) => callbacks.onFailure(err));

    await expect(auth.sendVerificationEmail('testuser')).rejects.toBe(err);
  });
});

describe('resetPassword', () => {
  it('confirmPassword にコードと新パスワードを渡す', async () => {
    cognitoUser.confirmPassword.mockImplementation((_code, _pw, callbacks) =>
      callbacks.onSuccess(),
    );

    await expect(auth.resetPassword('testuser', '123456', 'newpw')).resolves.toBe(true);

    expect(cognitoUser.confirmPassword).toHaveBeenCalledWith(
      '123456',
      'newpw',
      expect.any(Object),
    );
  });

  it('confirmPassword が失敗したら reject する', async () => {
    const err = new Error('reset failed');
    cognitoUser.confirmPassword.mockImplementation((_code, _pw, callbacks) =>
      callbacks.onFailure(err),
    );

    await expect(auth.resetPassword('testuser', '123456', 'newpw')).rejects.toBe(err);
  });
});

describe('changePassword', () => {
  const makeSigninSucceed = () => {
    cognitoUser.getUsername.mockReturnValue('testuser');
    cognitoUser.authenticateUser.mockImplementation((_details, callbacks) =>
      callbacks.onSuccess(buildAuthResult('jwt-token')),
    );
    cognitoUser.getSession.mockImplementation((cb) => cb(null, buildSession(true)));
  };

  it('現在のパスワードで再認証してから changePassword を呼ぶ', async () => {
    userPool.getCurrentUser.mockReturnValue(cognitoUser);
    makeSigninSucceed();
    cognitoUser.changePassword.mockImplementation((_old, _new, cb) => cb(null));

    await expect(auth.changePassword('oldpw', 'newpw')).resolves.toBeUndefined();

    expect(AuthenticationDetailsMock).toHaveBeenCalledWith({
      Username: 'testuser',
      Password: 'oldpw',
    });
    expect(cognitoUser.changePassword).toHaveBeenCalledWith(
      'oldpw',
      'newpw',
      expect.any(Function),
    );
  });

  it('ログインユーザーがいなければ No user found. で reject する', async () => {
    userPool.getCurrentUser.mockReturnValue(null);

    await expect(auth.changePassword('oldpw', 'newpw')).rejects.toThrow('No user found.');
  });

  it('再認証に失敗したら changePassword を呼ばずに reject する', async () => {
    const err = new Error('auth failed');
    userPool.getCurrentUser.mockReturnValue(cognitoUser);
    cognitoUser.getUsername.mockReturnValue('testuser');
    cognitoUser.authenticateUser.mockImplementation((_details, callbacks) =>
      callbacks.onFailure(err),
    );

    await expect(auth.changePassword('oldpw', 'newpw')).rejects.toBe(err);
    expect(cognitoUser.changePassword).not.toHaveBeenCalled();
  });

  it('changePassword 自体が失敗したら reject する', async () => {
    const err = new Error('change failed');
    userPool.getCurrentUser.mockReturnValue(cognitoUser);
    makeSigninSucceed();
    cognitoUser.changePassword.mockImplementation((_old, _new, cb) => cb(err));

    await expect(auth.changePassword('oldpw', 'newpw')).rejects.toBe(err);
  });
});

describe('changeEmail', () => {
  it('email 属性を updateAttributes で更新する', async () => {
    userPool.getCurrentUser.mockReturnValue(cognitoUser);
    cognitoUser.updateAttributes.mockImplementation((_attrs, cb) => cb(null, 'SUCCESS'));

    await expect(auth.changeEmail('new@example.com')).resolves.toBe('SUCCESS');

    expect(cognitoUser.updateAttributes).toHaveBeenCalledWith(
      [{ Name: 'email', Value: 'new@example.com' }],
      expect.any(Function),
    );
  });

  it('更新に失敗したら reject する', async () => {
    const err = new Error('update failed');
    userPool.getCurrentUser.mockReturnValue(cognitoUser);
    cognitoUser.updateAttributes.mockImplementation((_attrs, cb) => cb(err));

    await expect(auth.changeEmail('new@example.com')).rejects.toBe(err);
  });

  it('ログインユーザーがいなければ引数なしで reject する', async () => {
    userPool.getCurrentUser.mockReturnValue(null);

    await expect(auth.changeEmail('new@example.com')).rejects.toBeUndefined();
  });
});
