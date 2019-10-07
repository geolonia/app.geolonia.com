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
import {
  reducer as teamMemberReducer,
  State as TeamMemberState
} from "./actions/team-member";

// app type
export type AppState = {
  authSupport: AuthSupportState;
  userMeta: UserMetaState;
  team: TeamState;
  mapKey: MapKeyState;
  teamMember: TeamMemberState;
};

const appReducer = combineReducers({
  authSupport: authSupportReducer,
  userMeta: userMetaReducer,
  team: teamReducer,
  mapKey: mapKeyReducer,
  teamMember: teamMemberReducer
});

// store
export default createStore(appReducer);
