import customFetch from './fetch';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import * as GeoloniaAuth from '../auth/index';

test('should enrich fetch', async () => {
  const mockedFetch = jest.fn();
  const mockedSession = {
    getIdToken: () => ({
      getJwtToken: () => 'mock-id-token',
    }),
  } as CognitoUserSession;
  const mockedRefreshSession = () => mockedSession;

  // @ts-ignore
  GeoloniaAuth.refreshSession = mockedRefreshSession;
  // @ts-ignore
  global.fetch = mockedFetch;

  await customFetch(mockedSession, 'https://example.com');
  const [url, options] = mockedFetch.mock.calls[0];

  expect(url).toEqual('https://example.com');
  expect(options.headers.Authorization).toEqual('mock-id-token');
});
