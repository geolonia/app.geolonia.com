import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type State = {
  currentUser?: string;
  accessToken?: string;
  hasTrouble: boolean;
  isReady: boolean;
  isVerified: boolean;
  isLoggedIn: boolean;
};

const initialState: State = {
  hasTrouble: false,
  isReady: false,
  isVerified: false,
  isLoggedIn: false,
};

type SetCognitoUserPayload = { currentUser: string };
type SetAccessTokenPayload = { accessToken: string };

const authSupportSlice = createSlice({
  name: 'authSupport',
  initialState,
  reducers: {
    setCognitoUser(state, action: PayloadAction<SetCognitoUserPayload>) {
      state.currentUser = action.payload.currentUser;
    },
    setAccessToken(state, action: PayloadAction<SetAccessTokenPayload>) {
      state.accessToken = action.payload.accessToken;
    },
    getInTrouble(state) {
      state.hasTrouble = true;
    },
    setLoggedIn(state, action: PayloadAction<boolean>) {
      state.isLoggedIn = action.payload;
    },
    ready(state) {
      state.isReady = true;
    },
  },
});

const { actions, reducer } = authSupportSlice;
export const {
  setCognitoUser,
  setAccessToken,
  getInTrouble,
  setLoggedIn,
  ready,
} = actions;
export default reducer;
