import React, {useCallback, useEffect, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import Paper from "@material-ui/core/Paper";
import { GeoJsonMaxUploadSize, GeoJsonMaxUploadSizePaid } from "../../constants";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { __, sprintf } from "@wordpress/i18n";
import fetch from "../../api/custom-fetch";
import "./ImportDropZone.scss"
import { TileStatus } from './GeoJson';
const { REACT_APP_API_BASE, REACT_APP_STAGE } = process.env;

const uploadGeoJson = async (geojson: File, session: Geolonia.Session, teamId?: string, geojsonId?: string) => {
  const result = await fetch<{ links: { putGeoJSON: string; }; }>(
    session,
    `${REACT_APP_API_BASE}/${REACT_APP_STAGE}/geojsons/${geojsonId}/links?teamId=${teamId}`,
    { method: "GET" },
    { absPath: true }
  );

  if (result.error) {
    return result;
  }

  const signedURL = result.data.links.putGeoJSON;
  await fetch<any>(
    session,
    signedURL,
    {
      method: "PUT",
      body: geojson
    },
    { absPath: true, noAuth: true, decode: "text" }
  );
}

type Props = {
  getTileStatus: () => Promise<TileStatus>,
  setTileStatus: (value: TileStatus) => void,
  session: Geolonia.Session,
  isPaidTeam: boolean,
  teamId?: string,
  geojsonId?: string,
  customMessage?: React.ReactElement,
  tileStatus?: undefined | 'failure'
}

const Content = (props: Props) => {
  const [error, setError] = useState<string | null>(null);
  const {
    session,
    teamId,
    geojsonId,
    customMessage,
    setTileStatus,
    getTileStatus,
    tileStatus,
  } = props;

  useEffect(() => {
    if (tileStatus === 'failure') {
      setError(__('Failed to add your data. Your GeoJSON might be invalid format.'))
    }
  }, [tileStatus])

  const maxUploadSize = props.isPaidTeam ? GeoJsonMaxUploadSizePaid : GeoJsonMaxUploadSize;

  const onDrop = useCallback( async (acceptedFiles) => {
    if (!session || !teamId || !geojsonId) {
      setError(__('Error: Can not upload file. Please contact to customer support at https://geolonia.com/contact/'));
      return;
    }

    if (acceptedFiles.length !== 1) {
      setError(__('Error: Can not upload multiple files.'));
      return;
    }

    if (!acceptedFiles[0].name.endsWith('.geojson') && !acceptedFiles[0].name.endsWith('.json')) {
      setError(__('Error: Please upload *.geojson or *.json file.'));
      return;
    }

    if (acceptedFiles[0].size > maxUploadSize) {
      setError(sprintf(__("Error: Please upload GeoJSON file less than %d MB."), maxUploadSize / 1000000));
      return;
    }
    setError(null);
    setTileStatus("progress"); // NOTE: 最初のレスポンスまでに時間がかかるので、progress をセット。
    await uploadGeoJson(acceptedFiles[0], session, teamId, geojsonId);

    const status = await getTileStatus();
    setTileStatus(status);

  }, [geojsonId, getTileStatus, maxUploadSize, session, setTileStatus, teamId]);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

  return (
    <Paper className={"geojson-dropzone-container"}>
      <div className={"geojson-dropzone"} {...getRootProps()}>
        <input {...getInputProps()} accept='.json,.geojson' />
        {isDragActive ? <p>{__("Drop file to add your map.")}</p> : (
          <>
            <CloudUploadIcon fontSize="large" />
            <p>{__("Import GeoJSON from your computer.")}<br />({sprintf(__('Maximum upload file size: %d MB'), maxUploadSize / 1000000)})</p>
            <p>{__("Drag and drop a file here to add your map,")}<br />{__("Or click to choose your file")}</p>
            {customMessage}
          </>
        )}
        {error && !isDragActive && <div className="error">{error}</div>}
      </div>
    </Paper>
  )
}

export default Content;
