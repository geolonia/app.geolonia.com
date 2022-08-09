import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type State = Geolonia.Redux.State.UserMeta;

export const isUserMeta = (user: any): user is State => {
  if (!user) {
    return false;
  } else if (!user.username) {
    return false;
  } else if (!(user.links && typeof user.links.getAvatar === 'string')) {
    return false;
  } else {
    return true;
  }
};

export const initialState: State = {
  name: '',
  email: '',
  username: '',
  language: 'ja',
  timezone: '',
  links: {
    getAvatar: '',
    putAvatar: '',
  },
  avatarImage: undefined,
  hasPersonalAccessToken: false,
};

type SetPayload = State;
type SetAvatarPayload = { avatarImage?: string };

const userMetaSlice = createSlice({
  name: 'userMeta',
  initialState,
  reducers: {
    set(_state, action: PayloadAction<SetPayload>) {
      return action.payload;
    },
    setAvatar(state, action: PayloadAction<SetAvatarPayload>) {
      state.avatarImage = action.payload.avatarImage;
    },
  },
});

const { actions, reducer } = userMetaSlice;
export const {
  set,
  setAvatar,
} = actions;
export default reducer;
