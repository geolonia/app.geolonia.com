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

type SelectedTeamResult = {
  selectedTeam: Geolonia.Team | null
  isLoading: boolean
  refetch: () => void
}
export const useSelectedTeam: () => SelectedTeamResult = () => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state) => state.authSupport.isLoggedIn);
  const { data: teams, isLoading, refetch } = useGetTeamsQuery(undefined, {
    skip: !isLoggedIn,
  });
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

  return {
    selectedTeam,
    isLoading,
    refetch,
  };
};

export const useUserLanguage = () => {
  return useAppSelector((state) => state.userMeta.language);
};

const __loadingImages: Set<string> = new Set();

type UseImageFromURLHook = (
  key?: string,
  imageUrl?: string,
  opts?: {
    onError?: () => void,
  },
) => string | undefined
export const useImageFromURL: UseImageFromURLHook = (key, imageUrl, opts) => {
  const dispatch = useAppDispatch();
  const avatar = useAppSelector((state) => state.avatar.cachedAvatars[key || 'never']);

  const { onError } = (opts || {});

  useEffect(() => {
    // If key doesn't exist, we can't load it yet.
    if (!key) return;
    // If imageUrl doesn't exist, then we won't try the request.
    if (!imageUrl || imageUrl === '') return;
    // If the cached avatar is available, we'll just return that.
    if (typeof avatar !== 'undefined') return;
    // If there has already been a request to load this avatar, we'll wait
    // for the next one.
    if (__loadingImages.has(key)) return;

    __loadingImages.add(key);
    (async () => {
      let resp;
      try {
        resp = await fetch(imageUrl);
        if (!resp.ok) throw new Error(await resp.text());
      } catch (error) {
        __loadingImages.delete(key);
        if (typeof onError !== 'undefined') onError();
        return;
      }
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      __loadingImages.delete(key);
      dispatch(setAvatar({ key, value: url }));
    })();
  }, [key, avatar, imageUrl, dispatch, onError]);

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
