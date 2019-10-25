import { UserMetaState } from "./user-meta";

const SET = "TEAM_MEMBER/SET";
const MARK_ERROR = "TEAM_MEMBER/MARK_ERROR";
const ADD = "TEAM_MEMBER/ADD";
const UPDATE = "TEAM_MEMBER/UPDATE";
const DELETE = "TEAM_MEMBER/DELETE";

export const Roles = {
  Owner: "Owner" as "Owner",
  Member: "Member" as "Member",
  Deactivated: "Deactivated" as "Deactivated"
};

export type Member = UserMetaState & {
  userSub: string;
  role: keyof typeof Roles;
};

export type State = {
  [teamId: string]: {
    data: Member[];
    error?: boolean;
  };
};

const initialState = {};

type SetAction = {
  type: typeof SET;
  payload: { teamId: string; members: Member[] };
};
type MarkErrorAction = {
  type: typeof MARK_ERROR;
  payload: { teamId: string };
};
type AddAction = {
  type: typeof ADD;
  payload: { teamId: string; member: Member };
};
type UpdateAction = {
  type: typeof UPDATE;
  payload: { teamId: string; userSub: string; member: Partial<Member> };
};
type DeleteAction = {
  type: typeof DELETE;
  payload: { teamId: string; userSub: string };
};

type TeamMemberAction =
  | SetAction
  | MarkErrorAction
  | AddAction
  | UpdateAction
  | DeleteAction;

export const createActions = {
  set: (teamId: string, members: Member[]): SetAction => ({
    type: SET,
    payload: { teamId, members }
  }),
  markError: (teamId: string): MarkErrorAction => ({
    type: MARK_ERROR,
    payload: { teamId }
  }),
  add: (teamId: string, member: Member): AddAction => ({
    type: ADD,
    payload: { teamId, member }
  }),
  update: (
    teamId: string,
    userSub: string,
    member: Partial<Member>
  ): UpdateAction => ({
    type: UPDATE,
    payload: { teamId, userSub, member }
  }),
  delete: (teamId: string, userSub: string): DeleteAction => ({
    type: DELETE,
    payload: { teamId, userSub }
  })
};

const isSetAction = (action: TeamMemberAction): action is SetAction =>
  action.type === SET;

const isMarkErrorAction = (
  action: TeamMemberAction
): action is MarkErrorAction => action.type === MARK_ERROR;

const isAddAction = (action: TeamMemberAction): action is AddAction =>
  action.type === ADD;

const isUpdateAction = (action: TeamMemberAction): action is UpdateAction =>
  action.type === UPDATE;

const isDeleteAction = (action: TeamMemberAction): action is DeleteAction =>
  action.type === DELETE;

export const reducer = (
  state: State = initialState,
  action: TeamMemberAction
) => {
  if (isSetAction(action)) {
    return {
      ...state,
      [action.payload.teamId]: {
        ...state[action.payload.teamId],
        data: action.payload.members
      }
    };
  } else if (isMarkErrorAction(action)) {
    return {
      ...state,
      [action.payload.teamId]: {
        ...state[action.payload.teamId],
        error: true
      }
    };
  } else if (isAddAction(action)) {
    const { teamId, member } = action.payload;
    const teamMemberObject = state[teamId] || { data: [] };
    return {
      ...state,
      [teamId]: {
        ...state[teamId],
        data: [...teamMemberObject.data, member]
      }
    };
  } else if (isUpdateAction(action)) {
    const { teamId, member } = action.payload;
    const teamMemberObject = state[teamId] || { data: [] };
    const nextMemberIndex = teamMemberObject.data
      .map(member => member.userSub)
      .indexOf(action.payload.userSub);
    const nextMembers = [...teamMemberObject.data];
    nextMembers[nextMemberIndex] = {
      ...nextMembers[nextMemberIndex],
      ...member
    };

    return {
      ...state,
      [teamId]: {
        ...state[teamId],
        data: nextMembers
      }
    };
  } else if (isDeleteAction(action)) {
    const { teamId } = action.payload;
    const teamMemberObject = state[teamId] || { data: [] };
    const nextMemberIndex = teamMemberObject.data
      .map(member => member.userSub)
      .indexOf(action.payload.userSub);
    const nextMembers = [...teamMemberObject.data];
    nextMembers.splice(nextMemberIndex, 1);

    return {
      ...state,
      [teamId]: {
        ...state[teamId],
        data: nextMembers
      }
    };
  } else {
    return state;
  }
};
