import { useEffect, useMemo } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { setAvatar } from './actions/avatar';
import { selectTeam } from './actions/team';
import {
  useGetPlansQuery,
  useGetTeamsQuery,
} from './apis/app-api';
import { __ } from '@wordpress/i18n';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useSelectedTeam: () => Geolonia.Team | null = () => {
  const dispatch = useAppDispatch();
  const { data: teams, isLoading } = useGetTeamsQuery();
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

export const useUserLanguage = () => {
  return useAppSelector((state) => state.userMeta.language);
};

const __loadingAvatars: Set<string> = new Set();

export const useAvatarImage: (key?: string, imageUrl?: string) => string | undefined = (key, imageUrl) => {
  const dispatch = useAppDispatch();
  const avatar = useAppSelector((state) => state.avatar.cachedAvatars[key || 'never']);

  useEffect(() => {
    // If key doesn't exist, we can't load it yet.
    if (!key) return;
    // If imageUrl doesn't exist, then we won't try the request.
    if (!imageUrl || imageUrl === '') return;
    // If the cached avatar is available, we'll just return that.
    if (typeof avatar !== 'undefined') return;
    // If there has already been a request to load this avatar, we'll wait
    // for the next one.
    if (__loadingAvatars.has(key)) return;

    __loadingAvatars.add(key);
    (async () => {
      const resp = await fetch(imageUrl);
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      __loadingAvatars.delete(key);
      dispatch(setAvatar({ key, value: url }));
    })();
  }, [key, avatar, imageUrl, dispatch]);

  return avatar;
};

export const useGeoloniaPlans = () => {
  const { data: plans } = useGetPlansQuery();
  const freePlan: Geolonia.Billing.FreePlan = {
    planId: null,
    name: __('Free Plan'),
    duration: 'month',
    contactRequired: undefined,
  };

  return [freePlan, ...(plans || [])];
};
