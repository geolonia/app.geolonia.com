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
import { connect } from 'react-redux';
import { __ } from '@wordpress/i18n';
import { sleep } from '../../lib/sleep';

// hooks
import useGeoJSON from './GeoJson/hooks/use-geojson';

import './GeoJson.scss';
// constants
import { messageDisplayDuration } from '../../constants';
import { buildApiUrl } from '../../lib/api';

type OwnProps = Record<string, never>;

type StateProps = {
  session: Geolonia.Session;
  geojsonId?: string;
  teamId?: string;
  isPaidTeam: boolean;
};

type RouterProps = {
  match: { params: { id: string } };
  history: { push: (path: string) => void };
};

type Props = OwnProps & RouterProps & StateProps;

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
  const {
    session,
    teamId,
    geojsonId,
    isPaidTeam,
    history,
  } = props;

  const [message] = useState('');
  const [style, setStyle] = useState<string | undefined>();
  const [tileStatus, setTileStatus] = useState<TileStatus>(null);
  const [prevTeamId] = useState(teamId);
  const [gvpStep, setGvpStep] = useState<GVPStep>('started');

  // custom hooks
  const {
    geoJsonMeta,
    bounds,
    setGeoJsonMeta,
    error,
  } = useGeoJSON(props.session, props.geojsonId);

  // move on team change
  useEffect(() => {
    if (prevTeamId !== teamId) {
      history.push('/data/geojson');
    }
  }, [prevTeamId, history, teamId]);

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

  const onDeleteClick = useCallback(async () => {
    if (!teamId || !geojsonId) {
      return Promise.resolve();
    }

    return fetch(
      session,
      buildApiUrl(`/geojsons/${geojsonId}`),
      {
        method: 'PUT',
        body: JSON.stringify({ deleted: true }),
      },
    )
      .then((res) => {
        if (res.status < 400) {
          return res.json();
        } else {
          // will be caught at <Save />
          throw new Error();
        }
      })
      .then(() => {
        setTimeout(
          () => history.push('/data/geojson'),
          messageDisplayDuration,
        );
      });
  }, [session, teamId, geojsonId, history]);

  const stepProgress = useMemo(getStepProgress, []);

  const getTileStatus = useCallback(async () => {
    let status = 'progress';
    while (status !== 'created' && status !== 'failure') {
      await sleep(2500);
      try {
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
  }, [session, geojsonId, teamId]);

  useEffect(() => {
    if (geoJsonMeta) {
      setTileStatus(geoJsonMeta.gvp_status);
    }
  }, [geoJsonMeta]);

  // invalid url entered
  if (geoJsonMeta && geoJsonMeta.teamId !== teamId) {
    return null;
  }
  if (error) {
    return null;
  }

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
      session={session}
      teamId={teamId}
      geojsonId={geojsonId}
      isPaidTeam={isPaidTeam}
      tileStatus={tileStatus}
      getTileStatus={getTileStatus}
      setTileStatus={setTileStatus}
      setGvpStep={setGvpStep}
    />;
  } else if (tileStatus === 'created') {
    mapEditorElement = <MapEditor
      session={session}
      style={style}
      geojsonId={geojsonId}
      bounds={bounds}
    />;
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
          <StyleSelector style={style} setStyle={setStyle} />
          {/* <ExportButton GeoJsonID={geojsonId} drawObject={drawObject} /> */}
          <ImportDropZoneButton
            session={session}
            teamId={teamId}
            geojsonId={geojsonId}
            isPaidTeam={isPaidTeam}
            getTileStatus={getTileStatus}
            setTileStatus={setTileStatus}
            setGvpStep={setGvpStep}
          />
        </div>
      )}

      <div className="editor">
        {mapEditorElement}
      </div>

      {geojsonId && geoJsonMeta && <div className="geojson-meta">
        <GeoJsonMeta
          geojsonId={geojsonId}
          name={geoJsonMeta.name}
          isPublic={geoJsonMeta.isPublic}
          allowedOrigins={geoJsonMeta.allowedOrigins}
          teamId={geoJsonMeta.teamId}
          primaryApiKeyId={geoJsonMeta.primaryApiKeyId}
          status={geoJsonMeta.status}
          setGeoJsonMeta={setGeoJsonMeta}
          style={style}
          isPaidTeam={isPaidTeam}
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
          onClick={onDeleteClick}
        />
      </DangerZone>
    </div>
  );
};

export const mapStateToProps = (
  state: Geolonia.Redux.AppState,
  ownProps: OwnProps & RouterProps,
): StateProps => {
  const session = state.authSupport.session;
  const team = state.team.data[state.team.selectedIndex];
  if (team) {
    const { teamId } = team;
    const geojsonId = ownProps.match.params.id;
    return {
      session,
      teamId,
      geojsonId,
      isPaidTeam: team.isPaidTeam,
    };
  } else {
    return { session, isPaidTeam: false };
  }
};

export default connect(mapStateToProps)(GeoJson);
