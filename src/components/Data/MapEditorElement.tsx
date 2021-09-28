import React, { useMemo, useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import MapEditor from './MapEditor';
import ImportDropZone from './ImportDropZone';
import { LinearProgress, CircularProgress } from '@material-ui/core';
import ImportDropZoneButton from './ImportDropZoneButton';
import StyleSelector from './StyleSelector';
// hooks
import useMetadata from './GeoJson/hooks/use-metadata';

import { useSelectedTeam } from '../../redux/hooks';
import { useGetGeoJSONMetaQuery } from '../../redux/apis/api';


const mapEditorStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
};

const getStepProgress = (): { [key in Geolonia.GVPStep]: { text: string, progress: number } } => {
  return {
    started: { text: '', progress: 0 },
    uploading: { text: __('Uploading now..'), progress: 20 },
    processing: { text: __('Processing data..'), progress: 60 },
    done: { text: __('Adding your data to the map...'), progress: 90 },
  };
};

type Props = {
  geojsonId: string;
  tileStatus: Geolonia.TileStatus,
  setTileStatus: React.Dispatch<React.SetStateAction<Geolonia.TileStatus>>,
}

// Switch Map, Uploader or some Message Component
export const MapEditorElement: React.FC<Props> = (props) => {
  const { selectedTeam } = useSelectedTeam();
  const teamId = selectedTeam?.teamId || '';
  const [gvpStep, setGvpStep] = useState<Geolonia.GVPStep>('started');

  console.log(gvpStep);

  const { geojsonId, tileStatus, setTileStatus } = props;
  const stepProgress = useMemo(getStepProgress, []);

  const pollingInterval = (tileStatus === 'created' || tileStatus === 'failure') ? undefined : 5_000;
  // TODO: エラーハンドリング
  const { data: GeoJSONMeta } = useGetGeoJSONMetaQuery({geojsonId, teamId}, {
    skip: !selectedTeam,
    pollingInterval,
  });

  useEffect(() => {
    if (GeoJSONMeta && GeoJSONMeta.gvp_status) {
      setTileStatus(GeoJSONMeta.gvp_status);
    }
  }, [GeoJSONMeta, setTileStatus]);

  const stepper: React.ReactNode = <div style={{ width: '80%', height: '20px' }}>
    <p style={{ textAlign: 'center' }}>{stepProgress[gvpStep].text}</p>
    <LinearProgress variant="determinate" value={stepProgress[gvpStep].progress} />
  </div>;

  const { layerNames } = useMetadata(geojsonId);
  const isSimpleStyled = (
    Array.isArray(layerNames) &&
      layerNames.some((id: string) => id.startsWith('g-simplestyle-'))
  ) || layerNames === 'error'; // NOTE: fallback

  let mapEditorElement: JSX.Element | null = null;
  if (tileStatus === null) {
    mapEditorElement = <div style={mapEditorStyle}>
      <CircularProgress></CircularProgress>
    </div>;
  } else if (tileStatus === 'progress') {
    mapEditorElement = <div style={mapEditorStyle}>
      {stepper}
    </div>;
  } else if (tileStatus === undefined || tileStatus === 'failure') {
    mapEditorElement = <ImportDropZone
      geojsonId={geojsonId}
      tileStatus={tileStatus}
      // getTileStatus={() => Promise.resolve(tileStatus)}
      setTileStatus={setTileStatus}
      setGvpStep={setGvpStep}
    />;
  } else if (tileStatus === 'created') {
    if (isSimpleStyled) {
      mapEditorElement = <MapEditor geojsonId={geojsonId} />;
    } else {
      mapEditorElement = <div style={mapEditorStyle}>
        { __('In order to display the map, the style.json corresponding to the MBTiles you uploaded is required.') }
      </div>;
    }
  }
  return <>
    {tileStatus === 'created' && (
      <div className="nav">
        {isSimpleStyled && <StyleSelector />}
        {/* <ExportButton GeoJsonID={geojsonId} drawObject={drawObject} /> */}
        <ImportDropZoneButton
          geojsonId={geojsonId}
          // getTileStatus={() => Promise.resolve(tileStatus)}
          setTileStatus={setTileStatus}
          setGvpStep={setGvpStep}
        />
      </div>
    )}
    <div className={'editor'}>{mapEditorElement}</div>
  </>;
};

export default MapEditorElement
;
