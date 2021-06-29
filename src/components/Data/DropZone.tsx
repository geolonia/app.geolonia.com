import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { GeoJsonMaxUploadSize } from "../../constants";
import { __, sprintf } from "@wordpress/i18n";

type Props = {
  handle: Function
};

const Content = (props: Props) => {

  const fileUpload = props.handle
  const [error, setError] = React.useState<boolean>(false)

  const onDrop = useCallback( acceptedFiles => {

    if (acceptedFiles.length > 1) {
      setError(true)
    } else {
      setError(false)
      fileUpload(acceptedFiles)
    }
  }, [])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? <p>{__("Drop to add your GeoJSON")}</p> : (
        <>
          <p>{__("Import GeoJSON from your computer.")}<br />({sprintf(__('Maximum upload file size: %d MB'), GeoJsonMaxUploadSize / 1000000)})</p>
          <p>{__("Drag a file here to add your map,")}<br />{__("Or click to choose your file")}</p>
        </>
      )}
      {error && <p>{__("Can not upload multiple files.")}</p>}
    </div>
  )
}

export default Content;