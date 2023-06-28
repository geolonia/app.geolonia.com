import { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';

import { useGetGeoJSONMetaQuery } from '../../../../redux/apis/api';
import { useSelectedTeam } from '../../../../redux/hooks';

export type LSPageStatus = 'retrieving' | 'uploadable' | 'uploading' | 'processing' | 'success/uploadable' | 'failed/uploadable';

export type StepProgress = {
  scene: 'loading' | 'uploadable' | 'progress' | 'success',
  text: string,
  progress: number,
};

export const useGVP = (geojsonId: string) => {

  const { selectedTeam } = useSelectedTeam();
  const teamId = selectedTeam?.teamId || '';

  const [lsPageStatus, setLSPageStatus] = useState<LSPageStatus>('retrieving');
  const [timer, setTimer] = useState<null | NodeJS.Timeout>(null);

  // first access
  const { data: geoJSONMeta, refetch } = useGetGeoJSONMetaQuery({ geojsonId, teamId }, {
    skip: !selectedTeam,
  });
  const gvp_status = geoJSONMeta?.gvp_status;

  // control polling
  useEffect(() => {
    if (!timer && lsPageStatus === 'processing') {
      setTimer(setInterval(() => { refetch(); }, 2_500));
    } else if (timer && lsPageStatus !== 'processing') {
      clearInterval(timer);
      setTimer(null);
    }
  }, [lsPageStatus, refetch, timer]);

  // update page status
  useEffect(() => {
    if (geoJSONMeta) {
      if (gvp_status === 'created') {
        setLSPageStatus('success/uploadable');
      } else if (gvp_status === 'failure') {
        setLSPageStatus('failed/uploadable');
      } else if (gvp_status === 'progress') {
        setLSPageStatus('processing');
      } else {
        setLSPageStatus('uploadable');
      }
    } else {
      setLSPageStatus('retrieving');
    }
  }, [geoJSONMeta, gvp_status]);

  const stepProgress = getStepProgress(lsPageStatus);
  return {
    lsPageStatus,
    setLSPageStatus,
    stepProgress,
  };
};

const getStepProgress = (pageStatus: LSPageStatus): StepProgress => {
  switch (pageStatus) {
    case 'retrieving':
      return {
        scene: 'loading',
        text: '',
        progress: 0,
      };
    case 'uploadable':
    case 'failed/uploadable':
      return {
        scene: 'uploadable',
        text: '',
        progress: 0,
      };
    case 'uploading':
      return {
        scene: 'progress',
        text: __('Uploading now..'),
        progress: 20,
      };
    case 'processing':
      return {
        scene: 'progress',
        text: __('Processing data..'),
        progress: 60,
      };
    case 'success/uploadable':
      return {
        scene: 'success',
        text: __('Succeeded.'),
        progress: 100,
      };
  }
};

export default useGVP;
