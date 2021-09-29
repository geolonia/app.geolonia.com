import { useState, useMemo, useEffect } from 'react';
import { __ } from '@wordpress/i18n';

import { useGetGeoJSONMetaQuery } from '../../../../redux/apis/api';
import { useSelectedTeam } from '../../../../redux/hooks';

export type TransitionStatus = {
  gvp: 'retrieving' | 'none' | 'progress' | 'created' | 'failure',
  order: 'idoling' | 'upload-started' | 'process-started'
}

export type StepProgress = {
  scene: 'loading' | 'uploadable' | 'progress' | 'success',
  text: string,
  progress: number,
};

const isValidGVPStatus = (status: string): status is TransitionStatus['gvp'] => {
  return  ['retrieving', 'none', 'progress', 'created', 'failure'].includes(status);
};

const initialTransitionStatus: TransitionStatus = {
  gvp: 'retrieving' as const,
  order: 'idoling' as const,
};

export const useGVP = (geojsonId: string) => {

  const { selectedTeam } = useSelectedTeam();
  const teamId = selectedTeam?.teamId || '';

  const [transitionStatus, setTransitionStatus] = useState<TransitionStatus>(initialTransitionStatus);
  const [timerId, setTimerId] = useState<null | NodeJS.Timeout>(null);
  const { gvp, order } = transitionStatus;

  // first access
  const { data: geoJSONMeta, refetch } = useGetGeoJSONMetaQuery({geojsonId, teamId}, {
    skip: !selectedTeam,
  });

  // control polling
  useEffect(() => {
    const shouldPole = gvp === 'progress' && (order === 'process-started' || order === 'upload-started');
    if (shouldPole) {
      timerId && clearInterval(timerId);
      setTimerId(setInterval(() => { refetch(); }, 2_500));
    }
    return () => { timerId && clearInterval(timerId); };
  }, [gvp, order, refetch, timerId]);

  // update gvp
  useEffect(() => {
    const gvp_status =  (geoJSONMeta?.gvp_status || 'none');
    if (isValidGVPStatus(gvp_status)) {
      setTransitionStatus({ order: order, gvp: gvp_status });
    }
  }, [geoJSONMeta?.gvp_status, order]);

  const updateGVPOrder = (order: TransitionStatus['order']) => setTransitionStatus({ ...transitionStatus, order });

  const stepProgress = getStepProgress({ gvp, order });
  console.log(order, gvp, stepProgress.scene, geoJSONMeta);
  return {
    transitionStatus,
    updateGVPOrder,
    stepProgress,
  };
};

const getStepProgress = ({ gvp, order }: TransitionStatus): StepProgress => {

  if (order === 'idoling') {
    if (gvp === 'retrieving') {
      return {
        scene: 'loading',
        text: '',
        progress: 0,
      };
    } else if (gvp === 'created') {
      return {
        scene: 'success',
        text: '',
        progress: 0,
      };
    } else {
      // gvp === none || gvp === failure
      return {
        scene: 'uploadable',
        text: '',
        progress: 0,
      };
    }
  } else if (order === 'upload-started') {
    if (gvp === 'failure') {
      return {
        scene: 'uploadable',
        text: __('failure.'),
        progress: 20,
      };
    } else {
      return {
        scene: 'progress',
        text: __('Uploading now..'),
        progress: 20,
      };
    }
  } else {
    // order === 'process-started'
    if (gvp === 'created') {
      return {
        scene: 'success',
        text: __('Successed.'),
        progress: 100,
      };
    } else if (gvp === 'failure') {
      return {
        scene: 'uploadable',
        text: __('failure.'),
        progress: 60,
      };
    } else {
      return {
        scene: 'progress',
        text: __('Processing data..'),
        progress: 60,
      };
    }
  }
};

export default useGVP;
