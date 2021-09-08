import { useMemo } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { selectTeam } from './actions/team';
import { useGetTeamsQuery } from './apis/app-api';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useSelectedTeam: () => Geolonia.Team | null = () => {
  const dispatch = useAppDispatch();
  const { data: teams, isLoading } = useGetTeamsQuery(undefined);
  const selectedTeamId = useAppSelector((state) => state.team.selectedTeamId);

  const selectedTeam = useMemo(() => {
    if (isLoading || !teams) return null;
    if (
      (!selectedTeamId && teams.length > 0)
      ||
      !teams.find((team) => team.teamId === selectedTeamId)
    ) {
      dispatch(selectTeam({ teamId: teams[0].teamId }));
      return null;
    }
    return teams.find((team) => team.teamId === selectedTeamId) || teams[0];
  }, [ isLoading, dispatch, teams, selectedTeamId ]);

  return selectedTeam;
};
