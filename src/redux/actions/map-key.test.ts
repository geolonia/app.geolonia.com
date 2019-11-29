import { reducer, State, createActions, Key } from "./map-key";

const TEAM_ID = "test-team-id";

const commonKeyProps = {
  description: "",
  name: "",
  updateAt: "",
  enabled: true,
  forceDisabled: false,
  allowedOrigins: []
};

it("should sort api keys by creatAt when set", () => {
  const initialState: State = {
    [TEAM_ID]: {
      data: []
    }
  };
  const keys: Key[] = [
    {
      userKey: "0",
      createAt: "2019-11-19T04:00:00.000Z",
      ...commonKeyProps
    },
    {
      userKey: "1",
      createAt: "2019-11-19T03:00:00.000Z",
      ...commonKeyProps
    },
    {
      userKey: "2",
      createAt: "2019-11-19T05:00:00.000Z",
      ...commonKeyProps
    }
  ];

  const action = createActions.set(TEAM_ID, keys);
  const nextState = reducer(initialState, action);
  const nextKeys = nextState[TEAM_ID].data;
  const nextUserKeys = nextKeys.map(key => key.userKey);
  expect(nextUserKeys).toEqual(["2", "0", "1"]);
});

it("should sort api keys by creatAt when add", () => {
  const initialState: State = {
    [TEAM_ID]: {
      data: [
        {
          userKey: "0",
          createAt: "2019-11-19T04:00:00.000Z",
          ...commonKeyProps
        },
        {
          userKey: "1",
          createAt: "2019-11-19T03:00:00.000Z",
          ...commonKeyProps
        },
        {
          userKey: "2",
          createAt: "2019-11-19T05:00:00.000Z",
          ...commonKeyProps
        }
      ]
    }
  };

  const key: Key = {
    userKey: "3",
    createAt: "2019-11-20T00:00:00.000Z",
    ...commonKeyProps
  };

  const action = createActions.add(TEAM_ID, key);
  const nextState = reducer(initialState, action);
  const nextKeys = nextState[TEAM_ID].data;
  const nextUserKeys = nextKeys.map(key => key.userKey);
  expect(nextUserKeys).toEqual(["3", "2", "0", "1"]);
});
