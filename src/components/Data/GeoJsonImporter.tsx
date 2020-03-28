import React from "react";

import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { GeoJsonMaxUploadSize } from "../../constants";
import './GeoJsonImporter.scss'
import { __, sprintf } from "@wordpress/i18n";

type Props = {
  state: boolean;
  onClose: Function;
  GeoJsonImporter: Function;
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
  textAlign: 'left',
}

const Importer = (props: Props) => {
  const {state, onClose, GeoJsonImporter} = props;
  const [styleOuter, setStyleOuter] = React.useState<React.CSSProperties>(styleOuterDefault)
  const [error, setError] = React.useState<boolean>(false)

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(false)
    const files = event.currentTarget.files
    if (files) {
      if (GeoJsonMaxUploadSize > files[0].size) {
        const filereader = new FileReader()
        filereader.onloadend = handleFileRead
        filereader.readAsText(files[0])
      } else {
        setError(true)
      }
    }
  }

  const handleFileRead = (event: Event) => {
    const target = event.target as FileReader
    if (target && target.result) {
      try {
        const geojson = JSON.parse(target.result as string) as GeoJSON.FeatureCollection
        // Mapbox GL Draw needs `properties`, so it should be added.
        for (let i = 0; i < geojson.features.length; i++ ) {
          if ('undefined' === typeof geojson.features[i].properties) {
            geojson.features[i].properties = {}
          }
        }
        GeoJsonImporter(geojson)
      } catch (e) {
        setError(true)
      }
    }
  }

  return (
    <div className="geojson-importer" style={styleOuter} onClick={close}>
      <div className="inner" onClick={preventClose}>
        <h2><CloudUploadIcon fontSize="large" /> {__("Import GeoJSON")}</h2>
  <p>{__("Import GeoJSON from your computer.")}<br />({sprintf(__('Maximum upload file size: %d MB'), GeoJsonMaxUploadSize / 100000)})</p>
        <p><input type="file" accept='.json,.geojson' onChange={handleFileUpload} /></p>
        <p>{__("Features that are imported will always be added and the existing features will not be updated.")}</p>
        {error? <div className="error">{sprintf(__("Error: Please upload GeoJSON file less than %d MB."), GeoJsonMaxUploadSize / 100000)}</div> : <></>}
      </div>
    </div>
  );
};

export default Importer;
