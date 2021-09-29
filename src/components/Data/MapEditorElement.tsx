import React, { useState } from 'react';
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

type Props = {
  geojsonId: string;
}

// Switch Map, Uploader or some Message Component
export const MapEditorElement: React.FC<Props> = (props) => {
  const { geojsonId } = props;
  const { transitionStatus, updateGVPOrder, stepProgress } = useGVP(geojsonId);
  const { scene, text, progress } = stepProgress;
  const [style, setStyle] = useState<string>('');

  const stepper: React.ReactNode = <div style={{ width: '80%', height: '20px' }}>
    <p style={{ textAlign: 'center' }}>{text}</p>
    <LinearProgress variant="determinate" value={progress} />
  </div>;

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
      {stepper}
    </div>;
  } else if (scene === 'uploadable') {
    mapEditorElement = <ImportDropZone
      geojsonId={geojsonId}
      transitionStatus={transitionStatus}
      updateGVPOrder={updateGVPOrder}
    />;
  } else if (scene === 'success') {
    if (isSimpleStyled) {
      mapEditorElement = <MapEditor geojsonId={geojsonId} style={style} />;
    } else {
      mapEditorElement = <div style={mapEditorStyle}>
        { __('In order to display the map, the style.json corresponding to the MBTiles you uploaded is required.') }
      </div>;
    }
  }

  return <>
    {scene === 'success' && (
      <div className="nav">
        {isSimpleStyled && <StyleSelector style={style} setStyle={setStyle} />}
        {/* <ExportButton GeoJsonID={geojsonId} drawObject={drawObject} /> */}
        <ImportDropZoneButton
          geojsonId={geojsonId}
          transitionStatus={transitionStatus}
          updateGVPOrder={updateGVPOrder}
        />
      </div>
    )}
    {scene}
    <div className={'editor'}>{mapEditorElement}</div>
  </>;
};

export default MapEditorElement
;
