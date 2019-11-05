import { createStore, combineReducers, applyMiddleware } from "redux";
import { reducer as authSupportReducer } from "./actions/auth-support";
import { reducer as userMetaReducer } from "./actions/user-meta";
import { reducer as teamReducer } from "./actions/team";
import { reducer as mapKeyReducer } from "./actions/map-key";
import { reducer as teamMemberReducer } from "./actions/team-member";

import { appendReduxifyReducers } from "./reduxify";
import localStorageMiddleware from "./middlewares/local-storage";

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

// store
export default createStore(appReducer, applyMiddleware(localStorageMiddleware));
