import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const SELECTED_TEAM_ID_LSK = 'geolonia__persisted_selectedTeamId';
const getSelectedTeamIdFromLS = () => {
  try {
    return window.localStorage.getItem(SELECTED_TEAM_ID_LSK) || undefined;
  } catch {
    return undefined;
  }
};

const setSelectedTeamIdToLS = (teamId: string) => {
  try {
    window.localStorage.setItem(SELECTED_TEAM_ID_LSK, teamId);
  // eslint-disable-next-line no-empty
  } catch {}
};


type State = {
  selectedTeamId?: string
};

const initialState: State = {
  selectedTeamId: getSelectedTeamIdFromLS(),
};

type SelectTeamPayload = { teamId: string };

const teamSlice = createSlice({
  name: 'userMeta',
  initialState,
  reducers: {
    selectTeam(state, action: PayloadAction<SelectTeamPayload>) {
      setSelectedTeamIdToLS(action.payload.teamId);
      state.selectedTeamId = action.payload.teamId;
    },
  },
});

const { actions, reducer } = teamSlice;
export const {
  selectTeam,
} = actions;
export default reducer;
