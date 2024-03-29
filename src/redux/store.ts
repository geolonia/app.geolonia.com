import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authSupportReducer from './actions/auth-support';
import userMetaReducer from './actions/user-meta';
import teamReducer from './actions/team';
import avatarReducer from './actions/avatar';

import { appApi } from './apis/app-api';
import { api } from './apis/api';

const store = configureStore({
  reducer: {
    authSupport: authSupportReducer,
    userMeta: userMetaReducer,
    team: teamReducer,
    avatar: avatarReducer,
    [appApi.reducerPath]: appApi.reducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware()
      .concat(appApi.middleware)
      .concat(api.middleware)
  ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
