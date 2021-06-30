import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import Paper from "@material-ui/core/Paper";
import { GeoJsonMaxUploadSize } from "../../constants";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { __, sprintf } from "@wordpress/i18n";
import "./DropZone.scss"

type Props = {
  handle: Function
};

const Content = (props: Props) => {

  const fileUpload = props.handle
  const [error, setError] = React.useState<string | null>(null)

  const onDrop = useCallback( acceptedFiles => {

    if (acceptedFiles.length !== 1) {
      setError(__('Error: Can not upload multiple files.'))
      return
    }

    if (!acceptedFiles[0].name.endsWith('.geojson') && !acceptedFiles[0].name.endsWith('.json')) {
      setError(__('Error: Please upload *.geojson or *.json file.'))
      return
    }

    if (acceptedFiles[0].size > GeoJsonMaxUploadSize) {
      setError(sprintf(__("Error: Please upload GeoJSON file less than %d MB."), GeoJsonMaxUploadSize / 1000000))
      return
    }

    fileUpload(acceptedFiles)
    setError(null)

  }, [fileUpload])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <Paper className={"geojson-dropzone-container"}>
      <div className={"geojson-dropzone"} {...getRootProps()}>
        <input {...getInputProps()} accept='.json,.geojson' />
        {isDragActive ? <p>{__("Drop to add your GeoJSON")}</p> : (
          <>
            <CloudUploadIcon fontSize="large" />
            <p>{__("Import GeoJSON from your computer.")}<br />({sprintf(__('Maximum upload file size: %d MB'), GeoJsonMaxUploadSize / 1000000)})</p>
            <p>{__("Drag a file here to add your map,")}<br />{__("Or click to choose your file")}</p>
          </>
        )}
        {error? <div className="error">{error}</div> : <></>}
      </div>
    </Paper>
  )
}

export default Content;