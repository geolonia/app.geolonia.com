import React, { useMemo, useCallback, useEffect, useState } from 'react';

import fetch from '../../lib/fetch';

import MapEditor from './MapEditor';
import Delete from '../custom/Delete';
import DangerZone from '../custom/danger-zone';

import Title from '../custom/Title';
import ImportDropZoneButton from './ImportDropZoneButton';
import ImportDropZone from './ImportDropZone';
// import ExportButton from "./ExportButton";
import GeoJsonMeta from './GeoJsonMeta';
import StyleSelector from './StyleSelector';
import { LinearProgress } from '@material-ui/core';

// lib
import { __ } from '@wordpress/i18n';
import { sleep } from '../../lib/sleep';


// hooks
import useMetadata from './GeoJson/hooks/use-metadata';

import './GeoJson.scss';
// constants
import { messageDisplayDuration } from '../../constants';
import { buildApiUrl } from '../../lib/api';
import { useGetGeojsonMetaQuery, useDeleteGeoJSONMetaMutation } from '../../redux/apis/api';
import { useSelectedTeam } from '../../redux/hooks';
import { useHistory, useRouteMatch } from 'react-router';
import { getSession } from '../../auth';

type Props = Record<string, never>;

export type TileStatus = null | undefined | 'progress' | 'created' | 'failure';

export type GVPStep = 'started' | 'uploading' | 'processing' | 'done';

const getStepProgress = (): { [key in GVPStep]: { text: string, progress: number } } => {
  return {
    started: { text: '', progress: 0 },
    uploading: { text: __('Uploading now..'), progress: 20 },
    processing: { text: __('Processing data..'), progress: 60 },
    done: { text: __('Adding your data to the map...'), progress: 90 },
  };
};

const mapEditorStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
};

const GeoJson: React.FC<Props> = (props: Props) => {
  const history = useHistory();
  const match = useRouteMatch<{id: string}>();
  const geojsonId = match.params.id;

  const { selectedTeam } = useSelectedTeam();
  const teamId = selectedTeam?.teamId || '';
  const { data: geoJsonMeta } = useGetGeojsonMetaQuery({geojsonId, teamId}, {
    skip: !selectedTeam,
  });
  const [deleteGeoJSONMeta] = useDeleteGeoJSONMetaMutation();

  const [message] = useState('');
  const [style, setStyle] = useState<string | undefined>();
  const [tileStatus, setTileStatus] = useState<TileStatus>(null);
  const [gvpStep, setGvpStep] = useState<GVPStep>('started');
  const { layerNames } = useMetadata(geojsonId);

  // move on team change
  const [prevTeamId, setPrevTeamId] = useState<string | null>(null);
  useEffect(() => {
    if (!prevTeamId && !!teamId) {
      setPrevTeamId(teamId);
    } else if (prevTeamId !== teamId) {
      history.push('/data/geojson');
    }
  }, [history, prevTeamId, teamId]);

  const breadcrumbItems = [
    {
      title: __('Home'),
      href: '#/',
    },
    {
      title: __('Map'),
      href: null,
    },
    {
      title: __('Location Data'),
      href: '#/data/geojson',
    },
  ];

  const handleDeleteGeoJSONMeta = useCallback(async () => {
    if (!teamId || !geojsonId) {
      return Promise.resolve();
    }
    // TODO: エラーハンドリング
    await deleteGeoJSONMeta({teamId, geojsonId});
    await sleep(messageDisplayDuration);
    history.push('/data/geojson');
  }, [deleteGeoJSONMeta, geojsonId, history, teamId]);

  const stepProgress = useMemo(getStepProgress, []);

  const getTileStatus = useCallback(async () => {
    let status = 'progress';
    while (status !== 'created' && status !== 'failure') {
      await sleep(2500);
      try {
        const session = await getSession();
        // TODO どうやってポーリングする？
        const res = await fetch(
          session,
          buildApiUrl(`/geojsons/${geojsonId}?teamId=${teamId}`),
          { method: 'GET' },
        );
        const json = await res.json();
        status = json.gvp_status;

      } catch (error) {
        throw new Error();
      }
    }
    return status;
  }, [geojsonId, teamId]);

  useEffect(() => {
    if (geoJsonMeta) {
      setTileStatus(geoJsonMeta.gvp_status);
    }
  }, [geoJsonMeta]);

  // invalid url entered
  if (geoJsonMeta && geoJsonMeta.teamId !== teamId) {
    return null;
  }
  // if (error) {
  //   return null;
  // }

  const isSimpleStyled = (
    Array.isArray(layerNames) &&
      layerNames.some((id: string) => id.startsWith('g-simplestyle-'))
  ) || layerNames === 'error'; // NOTE: fallback

  const stepper: React.ReactNode = <div style={{ width: '80%', height: '20px' }}>
    <p style={{ textAlign: 'center' }}>{stepProgress[gvpStep].text}</p>
    <LinearProgress variant="determinate" value={stepProgress[gvpStep].progress} />
  </div>;

  let mapEditorElement: JSX.Element | null = null;
  if (tileStatus === null) {
    mapEditorElement = <div style={mapEditorStyle}>
      {stepper}
    </div>;
  } else if (tileStatus === 'progress') {
    mapEditorElement = <div style={mapEditorStyle}>
      {stepper}
    </div>;
  } else if (tileStatus === undefined || tileStatus === 'failure') {
    mapEditorElement = <ImportDropZone
      teamId={teamId}
      geojsonId={geojsonId}
      tileStatus={tileStatus}
      getTileStatus={getTileStatus}
      setTileStatus={setTileStatus}
      setGvpStep={setGvpStep}
    />;
  } else if (tileStatus === 'created') {
    if (isSimpleStyled) {
      mapEditorElement = <MapEditor
        style={style}
        geojsonId={geojsonId}
      />;
    } else {
      mapEditorElement = <div style={mapEditorStyle}>
        { __('In order to display the map, the style.json corresponding to the MBTiles you uploaded is required.') }
      </div>;
    }
  }
  return (
    <div className="gis-panel">
      <Title
        breadcrumb={breadcrumbItems}
        title={geoJsonMeta ? geoJsonMeta.name : ''}
      >
        {__(
          'Upload your location data here to display it on a map. Once the data has been uploaded, HTML code will be generated so you can embed it in your site. We currently support uploading GeoJSON, CSV and MBTiles files.',
        )}
      </Title>

      {tileStatus === 'created' && (
        <div className="nav">
          {isSimpleStyled && <StyleSelector style={style} setStyle={setStyle} />}
          {/* <ExportButton GeoJsonID={geojsonId} drawObject={drawObject} /> */}
          <ImportDropZoneButton
            teamId={teamId}
            geojsonId={geojsonId}
            getTileStatus={getTileStatus}
            setTileStatus={setTileStatus}
            setGvpStep={setGvpStep}
          />
        </div>
      )}

      <div className={'editor'}>
        {mapEditorElement}
      </div>

      {geojsonId && geoJsonMeta && <div className="geojson-meta">
        <GeoJsonMeta
          geojsonId={geojsonId}
          style={style}
        />
      </div>
      }

      <DangerZone
        whyDanger={__(
          'Once you delete an Dataset, there is no going back. Please be certain.',
        )}
      >
        <Delete
          text1={__('Are you sure you want to delete this Dataset?')}
          text2={__('Please type delete to confirm.')}
          answer={geoJsonMeta ? geoJsonMeta.name : void 0}
          errorMessage={message}
          onClick={handleDeleteGeoJSONMeta}
        />
      </DangerZone>
    </div>
  );
};

export default GeoJson;
