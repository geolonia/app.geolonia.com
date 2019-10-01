import { createStore, combineReducers } from "redux";
import {
  reducer as authSupportReducer,
  AuthSupportState
} from "./actions/auth-support";
import { reducer as userMetaReducer, UserMetaState } from "./actions/user-meta";
import { reducer as groupReducer, GroupState } from "./actions/group";

// app type
export type AppState = {
  authSupport: AuthSupportState;
  userMeta: UserMetaState;
  group: GroupState;
};

const appReducer = combineReducers({
  authSupport: authSupportReducer,
  userMeta: userMetaReducer,
  group: groupReducer
});

// store
export default createStore(appReducer);
