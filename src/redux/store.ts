import { createStore, combineReducers } from "redux";
import {
  reducer as authSupportReducer,
  AuthSupportState
} from "./actions/auth-support";
import { reducer as userMetaReducer, UserMetaState } from "./actions/user-meta";
import { reducer as teamReducer, TeamState } from "./actions/team";
import {
  reducer as mapKeyReducer,
  State as MapKeyState
} from "./actions/map-key";

// app type
export type AppState = {
  authSupport: AuthSupportState;
  userMeta: UserMetaState;
  team: TeamState;
  mapKey: MapKeyState;
};

const appReducer = combineReducers({
  authSupport: authSupportReducer,
  userMeta: userMetaReducer,
  team: teamReducer,
  mapKey: mapKeyReducer
});

// store
export default createStore(appReducer);
