import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AvatarState = {
  cachedAvatars: { [key: string]: string | undefined };
};

const initialState: AvatarState = {
  cachedAvatars: {},
};

const avatarSlice = createSlice({
  name: 'avatar',
  initialState,
  reducers: {
    setAvatar(state, action: PayloadAction<{key: string, value: string | undefined}>) {
      const {key, value} = action.payload;
      state.cachedAvatars[key] = value;
    },
  },
});

const { actions, reducer } = avatarSlice;
export const {
  setAvatar,
} = actions;
export default reducer;
