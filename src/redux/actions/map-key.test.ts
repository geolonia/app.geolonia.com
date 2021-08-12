import { reducer, State, createActions, Key } from './map-key';
import moment from 'moment';

const TEAM_ID = 'test-team-id';

const commonKeyProps = {
  description: '',
  name: '',
  enabled: true,
  forceDisabled: false,
  allowedOrigins: [],
};

it('should sort api keys by creatAt when set', () => {
  const initialState: State = {
    [TEAM_ID]: {
      data: [],
    },
  };
  const keys: Key[] = [
    {
      keyId: '0',
      userKey: '0',
      createAt: moment('2019-11-19T04:00:00.000Z'),
      ...commonKeyProps,
    },
    {
      keyId: '1',
      userKey: '1',
      createAt: moment('2019-11-19T03:00:00.000Z'),
      ...commonKeyProps,
    },
    {
      keyId: '2',
      userKey: '2',
      createAt: moment('2019-11-19T05:00:00.000Z'),
      ...commonKeyProps,
    },
  ];

  const action = createActions.set(TEAM_ID, keys);
  const nextState = reducer(initialState, action);
  const nextKeys = nextState[TEAM_ID].data;
  const nextUserKeys = nextKeys.map((key) => key.userKey);
  expect(nextUserKeys).toEqual(['2', '0', '1']);
});

it('should sort api keys by creatAt when add', () => {
  const initialState: State = {
    [TEAM_ID]: {
      data: [
        {
          keyId: '0',
          userKey: '0',
          createAt: moment('2019-11-19T04:00:00.000Z'),
          ...commonKeyProps,
        },
        {
          keyId: '1',
          userKey: '1',
          createAt: moment('2019-11-19T03:00:00.000Z'),
          ...commonKeyProps,
        },
        {
          keyId: '2',
          userKey: '2',
          createAt: moment('2019-11-19T05:00:00.000Z'),
          ...commonKeyProps,
        },
      ],
    },
  };

  const key: Key = {
    keyId: '3',
    userKey: '3',
    createAt: moment('2019-11-20T00:00:00.000Z'),
    ...commonKeyProps,
  };

  const action = createActions.add(TEAM_ID, key);
  const nextState = reducer(initialState, action);
  const nextKeys = nextState[TEAM_ID].data;
  const nextUserKeys = nextKeys.map((key) => key.userKey);
  expect(nextUserKeys).toEqual(['3', '2', '0', '1']);
});
