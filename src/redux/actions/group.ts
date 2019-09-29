export type Group = {
  groupId: string; // TODO: Add Slug and hide groupId
  name: string;
  isDefault?: true;
  role: "Owner" | "Member" | "Fired";
};

export type GroupState = {
  data: Group[];
  selectedIndex: number;
};

const initialState = { data: [], selectedIndex: 0 };

const SET_ACTION = "GROUPS/SET";
const SELECT_ACTION = "GROUPS/SELECT";
const ADD_ACTION = "GROUPS/ADD";

type SetAction = { type: typeof SET_ACTION; payload: { groups: Group[] } };
type SelectAction = { type: typeof SELECT_ACTION; payload: { index: number } };
type AddAction = { type: typeof ADD_ACTION; payload: { group: Group } };

type GroupAction = SetAction | SelectAction | AddAction;

const isSetAction = (action: GroupAction): action is SetAction =>
  action.type === SET_ACTION;

const isSelectAction = (action: GroupAction): action is SelectAction =>
  action.type === SELECT_ACTION;

const isAddAction = (action: GroupAction): action is AddAction =>
  action.type === ADD_ACTION;

export const createActions = {
  set: (groups: Group[]) => ({ type: SET_ACTION, payload: { groups } }),
  select: (index: number) => ({ type: SELECT_ACTION, payload: { index } }),
  add: (group: Group) => ({ type: ADD_ACTION, payload: { group } })
};

export const reducer = (
  state: GroupState = initialState,
  action: GroupAction
) => {
  if (isSetAction(action)) {
    return { ...state, data: action.payload.groups };
  } else if (isSelectAction(action)) {
    return { ...state, selectedIndex: action.payload.index };
  } else if (isAddAction(action)) {
    return { ...state, data: [...state.data, action.payload.group] };
  } else {
    return state;
  }
};
