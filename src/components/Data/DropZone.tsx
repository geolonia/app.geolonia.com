import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'

type Props = {
  handle: Function
};

const Content = (props: Props) => {

  const handleFileUpload = props.handle
  const [error, setError] = React.useState<boolean>(false)

  const onDrop = useCallback( acceptedFiles => {

    if(acceptedFiles.length > 1) {
      setError(true)
    } else {
      setError(false)
      handleFileUpload(acceptedFiles[0])
    }
    
  }, [])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag and drop some files here, or click to select files</p>
      }
      {
        error && <p>Can not upload multiple files.</p>
      }
    </div>
  )
}

export default Content;