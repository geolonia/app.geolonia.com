export type Team = {
  groupId: string; // TODO: Add Slug and hide groupId
  name: string;
  isDefault?: true;
  role: "Owner" | "Member" | "Fired";
};

export type TeamState = {
  data: Team[];
  selectedIndex: number;
};

const initialState = { data: [], selectedIndex: 0 };

const SET_ACTION = "TEAMS/SET";
const SELECT_ACTION = "TEAMS/SELECT";
const ADD_ACTION = "TEAMS/ADD";

type SetAction = { type: typeof SET_ACTION; payload: { teams: Team[] } };
type SelectAction = { type: typeof SELECT_ACTION; payload: { index: number } };
type AddAction = { type: typeof ADD_ACTION; payload: { team: Team } };

type TeamAction = SetAction | SelectAction | AddAction;

const isSetAction = (action: TeamAction): action is SetAction =>
  action.type === SET_ACTION;

const isSelectAction = (action: TeamAction): action is SelectAction =>
  action.type === SELECT_ACTION;

const isAddAction = (action: TeamAction): action is AddAction =>
  action.type === ADD_ACTION;

export const createActions = {
  set: (teams: Team[]) => ({ type: SET_ACTION, payload: { teams } }),
  select: (index: number) => ({ type: SELECT_ACTION, payload: { index } }),
  add: (team: Team) => ({ type: ADD_ACTION, payload: { team } })
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
    return { ...state, data: [...state.data, action.payload.team] };
  } else {
    return state;
  }
};
