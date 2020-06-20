import { Middleware } from "redux";
import { isSelectAction } from "../actions/team";
import { AppState } from "../../types";

export const SELECTED_TEAM_ID_KEY = "geolonia__persisted_selectedTeamId";

const localStorageMiddleware: Middleware = store => next => action => {
  if (isSelectAction(action)) {
    const selecttingTeamIndex = action.payload.index;
    const nextTeam = (store.getState() as AppState).team.data[
      selecttingTeamIndex
    ];
    if (nextTeam) {
      const nextTeamId = nextTeam.teamId;
      localStorage.setItem(SELECTED_TEAM_ID_KEY, nextTeamId);
    }
  }
  return next(action);
};

export default localStorageMiddleware;
