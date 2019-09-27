import { createStore, combineReducers } from "redux";
import {
  reducer as authSupportReducer,
  AuthSupportState
} from "./actions/auth-support";
import { reducer as userMetaReducer, UserMetaState } from "./actions/user-meta";

// app type
export type AppState = {
  authSupport: AuthSupportState;
  userMeta: UserMetaState;
};

const appReducer = combineReducers({
  authSupport: authSupportReducer,
  userMeta: userMetaReducer
});

// store
export default createStore(appReducer);
