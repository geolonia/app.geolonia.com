export type Group = {
  groupSub: string; // TODO: 外に出さないほうがいいかもしれないので、消す気がする
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

type SetAction = {
  type: typeof SET_ACTION;
  payload: {
    groups: Group[];
  };
};

type SelectAction = {
  type: typeof SELECT_ACTION;
  payload: { index: number };
};

type GroupAction = SetAction | SelectAction;

const isSetAction = (action: GroupAction): action is SetAction =>
  action.type === SET_ACTION;

const isSelectAction = (action: GroupAction): action is SelectAction =>
  action.type === SELECT_ACTION;

export const createActions = {
  set: (groups: Group[]) => ({ type: SET_ACTION, payload: { groups } }),
  select: (index: number) => ({ type: SELECT_ACTION, payload: { index } })
};

export const reducer = (
  state: GroupState = initialState,
  action: GroupAction
) => {
  if (isSetAction(action)) {
    return { ...state, data: action.payload.groups };
  } else if (isSelectAction(action)) {
    return { ...state, selectedIndex: action.payload.index };
  } else {
    return state;
  }
};
