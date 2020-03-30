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

type TypeUniqueIds = {
  [key: string]: boolean;
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
}

const Importer = (props: Props) => {
  const {state, onClose, GeoJsonImporter} = props;
  const [styleOuter, setStyleOuter] = React.useState<React.CSSProperties>(styleOuterDefault)
  const [error, setError] = React.useState<string | null>(null)

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
    setError(null)
    const files = event.currentTarget.files
    if (files) {
      if (GeoJsonMaxUploadSize > files[0].size) {
        const filereader = new FileReader()
        filereader.onloadend = handleFileRead
        filereader.readAsText(files[0])
      } else {
        setError(sprintf(__("Error: Please upload GeoJSON file less than %d MB."), GeoJsonMaxUploadSize / 1000000))
      }
    }
  }

  const handleFileRead = (event: Event) => {
    const target = event.target as FileReader
    if (target && target.result) {
      try {
        const geojson = JSON.parse(target.result as string) as GeoJSON.FeatureCollection
        const uniquieIds = {} as TypeUniqueIds
        // Mapbox GL Draw needs `properties`, so it should be added.
        for (let i = 0; i < geojson.features.length; i++ ) {
          // @ts-ignore
          if (geojson.features[i].ID || geojson.features[i].Id || geojson.features[i].iD) {
            throw new Error('invalid-case-of-identifier')
          }
          if (geojson.features[i].id) {
            if (uniquieIds[geojson.features[i].id as string]) {
              throw new Error('invalid-identifier')
            } else {
              uniquieIds[geojson.features[i].id as string] = true
            }
          }
          if ('undefined' === typeof geojson.features[i].properties) {
            geojson.features[i].properties = {}
          }
        }
        GeoJsonImporter(geojson)
      } catch (e) {
        if ('invalid-case-of-identifier') {
          setError(__('Error: The name of identifier `id` must be lower case.'))
        } else if ('invalid-identifier' === e.message) {
          setError(__("Error: The `id` of each `fueature` must be unique in the GeoJSON."))
        } else {
          setError(sprintf(__("Error: Please upload GeoJSON file less than %d MB."), GeoJsonMaxUploadSize / 1000000))
        }
      }
    }
  }

  return (
    <div className="geojson-importer" style={styleOuter} onClick={close}>
      <div className="inner" onClick={preventClose}>
        <h2><CloudUploadIcon fontSize="large" /> {__("Import GeoJSON")}</h2>
  <p>{__("Import GeoJSON from your computer.")}<br />({sprintf(__('Maximum upload file size: %d MB'), GeoJsonMaxUploadSize / 1000000)})</p>
        <p><input type="file" accept='.json,.geojson' onChange={handleFileUpload} /></p>
        <p>{__("Existing feature that has same `id` will be updated, not be added as a new feature.")}</p>
        {error? <div className="error">{error}</div> : <></>}
      </div>
    </div>
  );
};

export default Importer;
