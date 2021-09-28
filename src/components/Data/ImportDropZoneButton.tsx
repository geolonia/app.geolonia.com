import React, { useState, useEffect } from 'react';
import ImportDropZone from './ImportDropZone';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { __ } from '@wordpress/i18n';
import './ImportDropZoneButton.scss';
import type { TransitionStatus } from './GeoJson/hooks/use-gvp';

type Props = {
  geojsonId: string,
  transitionStatus: TransitionStatus
  updateGVPOrder: (order: TransitionStatus['order']) => void,
}

const styleOuterDefault: React.CSSProperties = {
  position: 'fixed',
  top: '0px',
  right: '0px',
  bottom: '0px',
  left: '0px',
  zIndex: 9999,
  display: 'none',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'left',
};

const ImportDropZoneButton = (props: Props) => {
  const {geojsonId, transitionStatus, updateGVPOrder} = props;
  const [stateImporter, setStateImporter] = useState<boolean>(false);
  const [styleOuter, setStyleOuter] = useState<React.CSSProperties>(styleOuterDefault);

  useEffect(() => {
    const style = {...styleOuterDefault};
    if (stateImporter) {
      style.display = 'flex';
    } else {
      style.display = 'none';
    }
    setStyleOuter(style);
  }, [stateImporter]);

  const close = () => {
    setStateImporter(false);
  };

  const preventClose = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
  };

  return (
    <>
      <button className="btn" onClick={() => setStateImporter(true)}>
        <CloudUploadIcon fontSize="small" />
        <span className="label">{__('Upload Data (GeoJSON / CSV / MBTiles)')}</span>
      </button>
      {stateImporter ? (
        <div className="geojson-importer geojson-dropzone-button" style={styleOuter} onClick={close}>
          <div className="inner" onClick={preventClose}>
            <ImportDropZone
              geojsonId={geojsonId}
              transitionStatus={transitionStatus}
              updateGVPOrder={updateGVPOrder}
              customMessage={__('Data that has already been uploaded will be overwritten.')}
            />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ImportDropZoneButton;
