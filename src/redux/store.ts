import { createStore, combineReducers } from "redux";
import {
  reducer as authSupportReducer,
  AuthSupportState
} from "./actions/auth-support";
import { reducer as userMetaReducer, UserMetaState } from "./actions/user-meta";
import { reducer as teamReducer, TeamState } from "./actions/team";

// app type
export type AppState = {
  authSupport: AuthSupportState;
  userMeta: UserMetaState;
  team: TeamState;
};

const appReducer = combineReducers({
  authSupport: authSupportReducer,
  userMeta: userMetaReducer,
  team: teamReducer
});

// store
export default createStore(appReducer);
