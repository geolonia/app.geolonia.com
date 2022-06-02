const SET = 'TEAM_MEMBER/SET';
const MARK_ERROR = 'TEAM_MEMBER/MARK_ERROR';
const ADD = 'TEAM_MEMBER/ADD';
const UPDATE = 'TEAM_MEMBER/UPDATE';
const DELETE = 'TEAM_MEMBER/DELETE';
const SET_AVATAR = 'TEAM_MEMBER/SET_AVATAR';

export const RoleOrders = {
  Owner: 0,
  Member: 1,
  Suspended: 2,
};

type State = Geolonia.Redux.State.TeamMember;
const initialState: State = {};

type SetAction = {
  type: typeof SET;
  payload: { teamId: string; members: Geolonia.Member[] };
};
type MarkErrorAction = {
  type: typeof MARK_ERROR;
  payload: { teamId: string };
};
type AddAction = {
  type: typeof ADD;
  payload: { teamId: string; member: Geolonia.Member };
};
type UpdateAction = {
  type: typeof UPDATE;
  payload: {
    teamId: string;
    userSub: string;
    member: Partial<Geolonia.Member>;
  };
};
type DeleteAction = {
  type: typeof DELETE;
  payload: { teamId: string; userSub: string };
};
type SetAvatarAction = {
  type: typeof SET_AVATAR;
  payload: { teamId: string; userSub: string; avatarImage?: string };
};

type TeamMemberAction =
  | SetAction
  | MarkErrorAction
  | AddAction
  | UpdateAction
  | DeleteAction
  | SetAvatarAction;

export const createActions = {
  set: (teamId: string, members: Geolonia.Member[]): SetAction => ({
    type: SET,
    payload: { teamId, members },
  }),
  markError: (teamId: string): MarkErrorAction => ({
    type: MARK_ERROR,
    payload: { teamId },
  }),
  add: (teamId: string, member: Geolonia.Member): AddAction => ({
    type: ADD,
    payload: { teamId, member },
  }),
  update: (
    teamId: string,
    userSub: string,
    member: Partial<Geolonia.Member>,
  ): UpdateAction => ({
    type: UPDATE,
    payload: { teamId, userSub, member },
  }),
  delete: (teamId: string, userSub: string): DeleteAction => ({
    type: DELETE,
    payload: { teamId, userSub },
  }),
  setAvatar: (
    teamId: string,
    userSub: string,
    avatarImage?: string,
  ): SetAvatarAction => ({
    type: SET_AVATAR,
    payload: { teamId, userSub, avatarImage },
  }),
};

const isSetAction = (action: TeamMemberAction): action is SetAction =>
  action.type === SET;

const isMarkErrorAction = (
  action: TeamMemberAction,
): action is MarkErrorAction => action.type === MARK_ERROR;

const isAddAction = (action: TeamMemberAction): action is AddAction =>
  action.type === ADD;

const isUpdateAction = (action: TeamMemberAction): action is UpdateAction =>
  action.type === UPDATE;

const isDeleteAction = (action: TeamMemberAction): action is DeleteAction =>
  action.type === DELETE;

const isSetAvatarAction = (
  action: TeamMemberAction,
): action is SetAvatarAction => action.type === SET_AVATAR;

export const reducer = (
  state: State = initialState,
  action: TeamMemberAction,
) => {
  if (isSetAction(action)) {
    const members = [...action.payload.members];
    members.sort((a, b) => RoleOrders[a.role] - RoleOrders[b.role]);
    return {
      ...state,
      [action.payload.teamId]: {
        ...state[action.payload.teamId],
        data: members,
      },
    };
  } else if (isMarkErrorAction(action)) {
    return {
      ...state,
      [action.payload.teamId]: {
        ...state[action.payload.teamId],
        error: true,
      },
    };
  } else if (isAddAction(action)) {
    const { teamId, member } = action.payload;
    const teamMemberObject = state[teamId] || { data: [] };
    const members = [...teamMemberObject.data, member];
    members.sort((a, b) => RoleOrders[a.role] - RoleOrders[b.role]);
    return {
      ...state,
      [teamId]: {
        ...state[teamId],
        data: members,
      },
    };
  } else if (isUpdateAction(action)) {
    const { teamId, member } = action.payload;
    const teamMemberObject = state[teamId] || { data: [] };
    const nextMemberIndex = teamMemberObject.data
      .map((member) => member.userSub)
      .indexOf(action.payload.userSub);
    const nextMembers = [...teamMemberObject.data];
    nextMembers[nextMemberIndex] = {
      ...nextMembers[nextMemberIndex],
      ...member,
    };
    nextMembers.sort((a, b) => RoleOrders[a.role] - RoleOrders[b.role]);
    return {
      ...state,
      [teamId]: {
        ...state[teamId],
        data: nextMembers,
      },
    };
  } else if (isDeleteAction(action)) {
    const { teamId } = action.payload;
    const teamMemberObject = state[teamId] || { data: [] };
    const nextMemberIndex = teamMemberObject.data
      .map((member) => member.userSub)
      .indexOf(action.payload.userSub);
    const nextMembers = [...teamMemberObject.data];
    nextMembers.splice(nextMemberIndex, 1);

    return {
      ...state,
      [teamId]: {
        ...state[teamId],
        data: nextMembers,
      },
    };
  } else if (isSetAvatarAction(action)) {
    const { teamId, userSub, avatarImage } = action.payload;
    const prevMembers = state[teamId].data;
    const nextMembers = prevMembers.map((member) => {
      if (member.userSub === userSub) {
        return { ...member, avatarImage };
      } else {
        return member;
      }
    });

    return {
      ...state,
      [teamId]: {
        ...state[teamId],
        data: nextMembers,
      },
    };
  } else {
    return state;
  }
};
