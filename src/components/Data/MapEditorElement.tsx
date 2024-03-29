import React, { useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';
import MapEditor from './MapEditor';
import ImportDropZone from './ImportDropZone';
import { LinearProgress, CircularProgress } from '@material-ui/core';
import ImportDropZoneButton from './ImportDropZoneButton';
import StyleSelector from './StyleSelector';
// hooks
import useMetadata from './GeoJson/hooks/use-metadata';
import useGVP from './GeoJson/hooks/use-gvp';

const mapEditorStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
};

type StepperProps = {
  text: string;
  progress: number;
  lazy: number;
};

type Props = {
  geojsonId: string;
};

const Stepper: React.FC<StepperProps> = ({text, progress, lazy}) => {
  const [lazyProgress, setLazyProgress] = useState(0);
  useEffect(() => {
    setTimeout(() => { setLazyProgress(progress); }, lazy);
  }, [lazy, progress]);

  return <div style={{ width: '80%', height: '20px' }}>
    <p style={{ textAlign: 'center' }}>{text}</p>
    <LinearProgress variant="determinate" value={lazyProgress} />
  </div>;
};

// Switch Map, Uploader or some Message Component
export const MapEditorElement: React.FC<Props> = (props) => {
  const { geojsonId } = props;
  const { lsPageStatus, setLSPageStatus, stepProgress } = useGVP(geojsonId);
  const { scene, text, progress } = stepProgress;
  const [styleIdentifier, setStyleIdentifier] = useState<string>('');

  const { layerNames } = useMetadata(geojsonId);
  const isSimpleStyled = (
    Array.isArray(layerNames) &&
      layerNames.some((id: string) => id.startsWith('g-simplestyle-'))
  ) || layerNames === 'error'; // NOTE: fallback

  let mapEditorElement: JSX.Element | null = null;
  if (scene === 'loading') {
    mapEditorElement = <div style={mapEditorStyle}>
      <CircularProgress />
    </div>;
  } else if (scene === 'progress') {
    mapEditorElement = <div style={mapEditorStyle}>
      <Stepper text={text} progress={progress} lazy={50} />
    </div>;
  } else if (scene === 'uploadable') {
    mapEditorElement = <ImportDropZone
      geojsonId={geojsonId}
      lsPageStatus={lsPageStatus}
      setLSPageStatus={setLSPageStatus}
    />;
  } else if (scene === 'success') {
    if (isSimpleStyled) {
      mapEditorElement = <MapEditor geojsonId={geojsonId} style={styleIdentifier} />;
    } else {
      mapEditorElement = <div style={mapEditorStyle}>
        { layerNames && __('In order to display the map, the style.json corresponding to the MBTiles you uploaded is required.') }
      </div>;
    }
  }

  return <>
    {scene === 'success' && (
      <div className="nav">
        {isSimpleStyled && <StyleSelector styleIdentifier={styleIdentifier} setStyleIdentifier={setStyleIdentifier} />}
        {/* <ExportButton GeoJsonID={geojsonId} drawObject={drawObject} /> */}
        <ImportDropZoneButton
          geojsonId={geojsonId}
          lsPageStatus={lsPageStatus}
          setLSPageStatus={setLSPageStatus}
        />
      </div>
    )}
    <div className={'editor'}>{mapEditorElement}</div>
  </>;
};

export default MapEditorElement
;
