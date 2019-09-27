const SET_USER_META_ACTION = "USER_META/SET";

export type UserMetaState = {
  name: string;
  language: string;
  links: {
    getAvatar: string;
    putAvatar: string;
  };
};

export const initialState: UserMetaState = {
  name: "",
  language: "ja",
  links: {
    getAvatar: "",
    putAvatar: ""
  }
};

type SetUserMetaAction = {
  type: typeof SET_USER_META_ACTION;
  payload: UserMetaState;
};

type UserMetaAction = SetUserMetaAction;

export const createActions = {
  setUserMeta: (userMeta: UserMetaState) => ({
    type: SET_USER_META_ACTION,
    payload: userMeta
  })
};

const isSetUserMetaAction = (
  action: UserMetaAction
): action is SetUserMetaAction => action.type === SET_USER_META_ACTION;

export const reducer = (
  state: UserMetaState = initialState,
  action: UserMetaAction
) => {
  if (isSetUserMetaAction(action)) {
    return { ...state, ...action.payload };
  } else {
    return state;
  }
};
