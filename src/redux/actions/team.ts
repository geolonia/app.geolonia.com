export type Team = {
  teamId: string;
  name: string;
  description: string;
  url: string;
  role: "Owner" | "Member" | "Fired";
  billingEmail: string;
  isDeleted?: boolean;
  links: {
    getAvatar: string;
    putAvatar: string;
  };
  avatarImage: string | void;
};

export const isTeam = (team: any): team is Team => {
  if (!team || !team.teamId || !team.role || !team.links) {
    return false;
  } else {
    return true;
  }
};

export type TeamState = {
  data: Team[];
  selectedIndex: number;
};

const initialState = { data: [], selectedIndex: 0 };

const SET_ACTION = "TEAM/SET";
const SELECT_ACTION = "TEAM/SELECT";
const ADD_ACTION = "TEAM/ADD";
const UPDATE_ACTION = "TEAM/UPDATE";
const SET_AVATAR_ACTION = "TEAM/SET_AVATAR";

type SetAction = { type: typeof SET_ACTION; payload: { teams: Team[] } };
type SelectAction = { type: typeof SELECT_ACTION; payload: { index: number } };
type AddAction = { type: typeof ADD_ACTION; payload: { team: Team } };
type UpdateAction = {
  type: typeof UPDATE_ACTION;
  payload: { index: number; team: Partial<Team> };
};
type SetAvatarAction = {
  type: typeof SET_AVATAR_ACTION;
  payload: { index: number; avatarImage: string | void };
};
type TeamAction =
  | SetAction
  | SelectAction
  | AddAction
  | UpdateAction
  | SetAvatarAction;

const isSetAction = (action: TeamAction): action is SetAction =>
  action.type === SET_ACTION;

export const isSelectAction = (action: TeamAction): action is SelectAction =>
  action.type === SELECT_ACTION;

const isAddAction = (action: TeamAction): action is AddAction =>
  action.type === ADD_ACTION;

const isUpdateAciton = (action: TeamAction): action is UpdateAction =>
  action.type === UPDATE_ACTION;

const isSetAvatarAction = (action: TeamAction): action is SetAvatarAction =>
  action.type === SET_AVATAR_ACTION;

export const createActions = {
  set: (teams: Team[]) => ({ type: SET_ACTION, payload: { teams } }),
  select: (index: number) => ({ type: SELECT_ACTION, payload: { index } }),
  add: (team: Team) => ({ type: ADD_ACTION, payload: { team } }),
  update: (index: number, team: Partial<Team>) => ({
    type: UPDATE_ACTION,
    payload: { index, team }
  }),
  setAvatar: (index: number, avatarImage: string | void) => ({
    type: SET_AVATAR_ACTION,
    payload: { index, avatarImage }
  })
};

export const reducer = (
  state: TeamState = initialState,
  action: TeamAction
) => {
  if (isSetAction(action)) {
    return { ...state, data: action.payload.teams };
  } else if (isSelectAction(action)) {
    return { ...state, selectedIndex: action.payload.index };
  } else if (isAddAction(action)) {
    const newTeam = { links: {}, ...action.payload.team };
    return { ...state, data: [...state.data, newTeam] };
  } else if (isUpdateAciton(action)) {
    const nextTeams = [...state.data];
    nextTeams[action.payload.index] = {
      ...nextTeams[action.payload.index],
      ...action.payload.team
    };
    return { ...state, data: nextTeams };
  } else if (isSetAvatarAction(action)) {
    const nextTeams = [...state.data];
    nextTeams[action.payload.index] = {
      ...nextTeams[action.payload.index],
      avatarImage: action.payload.avatarImage
    };
    return { ...state, data: nextTeams };
  } else {
    return state;
  }
};
