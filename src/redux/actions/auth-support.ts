import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type State = {
  currentUser?: string;

  // TODO: delete because it is not serializable
  session?: Geolonia.Session;

  accessToken?: string;
  hasTrouble: boolean;
  isReady: boolean;
  isVerified: boolean;
};

const initialState: State = {
  hasTrouble: false,
  isReady: false,
  isVerified: false,
};

type SetCognitoUserPayload = { currentUser: string };
type SetSessionPayload = { session: Geolonia.Session };
type SetAccessTokenPayload = { accessToken: string };

const authSupportSlice = createSlice({
  name: 'authSupport',
  initialState,
  reducers: {
    setCognitoUser(state, action: PayloadAction<SetCognitoUserPayload>) {
      state.currentUser = action.payload.currentUser;
    },
    setSession(state, action: PayloadAction<SetSessionPayload>) {
      state.session = action.payload.session;
    },
    setAccessToken(state, action: PayloadAction<SetAccessTokenPayload>) {
      state.accessToken = action.payload.accessToken;
    },
    getInTrouble(state) {
      state.hasTrouble = true;
    },
    ready(state) {
      state.isReady = true;
    },
  },
});

const { actions, reducer } = authSupportSlice;
export const {
  setCognitoUser,
  setSession,
  setAccessToken,
  getInTrouble,
  ready,
} = actions;
export default reducer;
