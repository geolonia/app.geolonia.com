const SET_ACTION = "USER_META/SET";
const SET_AVATAR_ACTION = "USER_META/SET_AVATAR";

export type State = {
  name: string;
  username: string;
  language: string;
  timezone: string;
  links: {
    getAvatar: string;
    putAvatar: string;
  };
  avatarImage: string | void;
};

export const isUserMeta = (user: any): user is State => {
  if (!user) {
    return false;
  } else if (!user.username) {
    return false;
  } else if (!(user.links && user.links.getAvatar)) {
    return false;
  } else {
    return true;
  }
};

export const initialState: State = {
  name: "",
  username: "",
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
  payload: State;
};

type SetAvatarAction = {
  type: typeof SET_AVATAR_ACTION;
  payload: { avatarImage: string | void };
};

type UserMetaAction = SetAction | SetAvatarAction;

export const createActions = {
  set: (userMeta: State) => ({
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
  state: State = initialState,
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
