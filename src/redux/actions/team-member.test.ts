import { reducer, createActions } from './team-member';
import { Roles } from '../../constants';

type State = Geolonia.Redux.State.TeamMember;

const TEAM_ID = 'test-team-id';

const commonMemberProps = {
  name: 'name',
  username: 'username',
  language: 'ja',
  timezone: 'tokyo',
  links: { getAvatar: '', putAvatar: '' },
  avatarImage: '',
};

it('should sort member when set', () => {
  const initialState: State = {
    [TEAM_ID]: {
      data: [],
    },
  };
  const members: any[] = [
    {
      userSub: '0',
      role: Roles.Suspended,
      ...commonMemberProps,
    },
    {
      userSub: '1',
      role: Roles.Owner,
      ...commonMemberProps,
    },
    {
      userSub: '2',
      role: Roles.Member,
      ...commonMemberProps,
    },
  ];
  const action = createActions.set(TEAM_ID, members);
  const nextState = reducer(initialState, action);
  const orderedRoles = nextState[TEAM_ID].data.map((member) => member.role);
  expect(orderedRoles).toEqual([Roles.Owner, Roles.Member, Roles.Suspended]);
});

it('should sort member when add', () => {
  const initialState: State = {
    [TEAM_ID]: {
      data: [
        {
          userSub: '0',
          role: Roles.Suspended,
          ...commonMemberProps,
        },
        {
          userSub: '1',
          role: Roles.Owner,
          ...commonMemberProps,
        },
        {
          userSub: '2',
          role: Roles.Member,
          ...commonMemberProps,
        },
      ],
    },
  };
  const member: Geolonia.Member = {
    userSub: '3',
    role: Roles.Owner,
    ...commonMemberProps,
  };
  const action = createActions.add(TEAM_ID, member);
  const nextState = reducer(initialState, action);
  const orderedRoles = nextState[TEAM_ID].data.map((member) => member.role);
  expect(orderedRoles).toEqual([
    Roles.Owner,
    Roles.Owner,
    Roles.Member,
    Roles.Suspended,
  ]);
});

it('should sort member when update', () => {
  const initialState: State = {
    [TEAM_ID]: {
      data: [
        {
          userSub: '0',
          role: Roles.Suspended,
          ...commonMemberProps,
        },
        {
          userSub: '1',
          role: Roles.Owner,
          ...commonMemberProps,
        },
        {
          userSub: '2',
          role: Roles.Member,
          ...commonMemberProps,
        },
      ],
    },
  };
  const action = createActions.update(TEAM_ID, '1', { role: Roles.Suspended });
  const nextState = reducer(initialState, action);
  const userSubOrder = nextState[TEAM_ID].data.map((member) => member.userSub);
  expect(userSubOrder).toEqual(['2', '0', '1']);
});
