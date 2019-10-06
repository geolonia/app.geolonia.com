const SET_ACTION = "USER_META/SET";
const SET_AVATAR_ACTION = "USER_META/SET_AVATAR";

export type UserMetaState = {
  name: string;
  language: string;
  timezone: string;
  links: {
    getAvatar: string;
    putAvatar: string;
  };
  avatarImage: string | void;
};

export const initialState: UserMetaState = {
  name: "",
  language: "ja",
  timezone: "",
  links: {
    getAvatar: "",
    putAvatar: ""
  },
  avatarImage: undefined
};

type SetAction = {
  type: typeof SET_ACTION;
  payload: UserMetaState;
};

type SetAvatarAction = {
  type: typeof SET_AVATAR_ACTION;
  payload: { avatarImage: string | void };
};

type UserMetaAction = SetAction | SetAvatarAction;

export const createActions = {
  set: (userMeta: UserMetaState) => ({
    type: SET_ACTION,
    payload: userMeta
  }),
  setAvatar: (avatarImage: string | void) => {
    return {
      type: SET_AVATAR_ACTION,
      payload: {
        avatarImage
      }
    };
  }
};

const isSetAction = (action: UserMetaAction): action is SetAction =>
  action.type === SET_ACTION;

const isSetAvatarAction = (action: UserMetaAction): action is SetAvatarAction =>
  action.type === SET_AVATAR_ACTION;

export const reducer = (
  state: UserMetaState = initialState,
  action: UserMetaAction
) => {
  if (isSetAction(action)) {
    return { ...state, ...action.payload };
  } else if (isSetAvatarAction(action)) {
    return { ...state, avatarImage: action.payload.avatarImage };
  } else {
    return state;
  }
};
