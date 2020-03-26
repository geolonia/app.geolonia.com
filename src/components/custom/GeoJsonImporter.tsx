import React from "react";

import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import './GeoJsonImporter.scss'

type Props = {
  state: boolean;
  onClose: Function;
};

const styleOuterDefault: React.CSSProperties = {
  position: 'fixed',
  top: '0px',
  right: '0px',
  bottom: '0px',
  left: '0px',
  zIndex: 9999,
  display: 'none',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}

const Importer = (props: Props) => {
  const {state, onClose} = props;
  const [styleOuter, setStyleOuter] = React.useState<React.CSSProperties>(styleOuterDefault)


  React.useEffect(() => {
    const style = {...styleOuterDefault}
    if (state) {
      style.display = 'flex'
    } else {
      style.display = 'none'
    }
    setStyleOuter(style)
  }, [state])

  const close = () => {
    onClose()
  }

  const preventClose = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()
  }

  return (
    <div className="geojson-importer" style={styleOuter} onClick={close}>
      <div className="inner" onClick={preventClose}>
        <h2><CloudUploadIcon fontSize="large" /> Import GeoJSON</h2>
        <h3>Import GeoJSON from your computer.</h3>
        <p><input type="file" /></p>
      </div>
    </div>
  );
};

export default Importer;
