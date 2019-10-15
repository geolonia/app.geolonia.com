import { Middleware } from "redux";
import { isSelectAction } from "../actions/team";
import { AppState } from "../store";

export const SELECTED_TEAM_ID = "geolonia__selectedTeamId";

const localStorageMiddleware: Middleware = store => next => action => {
  if (isSelectAction(action)) {
    const selecttingTeamIndex = action.payload.index;
    const nextTeam = (store.getState() as AppState).team.data[
      selecttingTeamIndex
    ];
    console.log(nextTeam);
    if (nextTeam) {
      const nextTeamId = nextTeam.teamId;
      localStorage.setItem(SELECTED_TEAM_ID, nextTeamId);
    }
  }
  return next(action);
};

export default localStorageMiddleware;
