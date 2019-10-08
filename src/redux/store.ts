import { createStore, combineReducers, applyMiddleware } from "redux";
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
import Redux from "redux";

import { appendReduxifyReducers } from "./reduxify";

// app type
export type AppState = {
  authSupport: AuthSupportState;
  userMeta: UserMetaState;
  team: TeamState;
  mapKey: MapKeyState;
  teamMember: TeamMemberState;
};

const appReducer = combineReducers(
  // @ts-ignore
  appendReduxifyReducers({
    authSupport: authSupportReducer,
    userMeta: userMetaReducer,
    team: teamReducer,
    mapKey: mapKeyReducer,
    teamMember: teamMemberReducer
  })
);

// middleware
export const middleware: Redux.Middleware = store => next => action => {
  // console.log(action);
  return next(action);
};

// store
export default createStore(appReducer, applyMiddleware(middleware));
