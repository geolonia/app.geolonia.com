import React, {useCallback, useEffect, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import Paper from '@material-ui/core/Paper';
import { GeoJsonMaxUploadSize, GeoJsonMaxUploadSizePaid } from '../../constants';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { __, sprintf } from '@wordpress/i18n';
import fetch from '../../api/custom-fetch';
import './ImportDropZone.scss';
import { TileStatus, GVPStep } from './GeoJson';
import { sleep } from '../../lib/sleep';
const { REACT_APP_API_BASE, REACT_APP_STAGE } = process.env;

type GeoJSONLinksResp = {
  links: {
    putGeoJSON: string;
    putCSV: string;
  }
};

const uploadGeoJson = async (geojson: File, session: Geolonia.Session, teamId?: string, geojsonId?: string) => {
  const result = await fetch<GeoJSONLinksResp>(
    session,
    `${REACT_APP_API_BASE}/${REACT_APP_STAGE}/geojsons/${geojsonId}/links?teamId=${teamId}`,
    { method: 'GET' },
    { absPath: true },
  );

  if (result.error) {
    return result;
  }

  let signedURL = result.data.links.putGeoJSON;
  let contentType = 'application/json';
  if (geojson.name.endsWith('.csv')) {
    signedURL = result.data.links.putCSV;
    contentType = 'text/csv';
  }
  await fetch<any>(
    session,
    signedURL,
    {
      method: 'PUT',
      body: geojson,
      headers: {
        'Content-Type': contentType,
      },
    },
    { absPath: true, noAuth: true, decode: 'text' },
  );
};

type Props = {
  getTileStatus: () => Promise<TileStatus>,
  setTileStatus: (value: TileStatus) => void,
  setGvpStep: (value: GVPStep) => void,
  session: Geolonia.Session,
  isPaidTeam: boolean,
  teamId?: string,
  geojsonId?: string,
  customMessage?: string,
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
    setGvpStep,
    getTileStatus,
    tileStatus,
  } = props;

  useEffect(() => {
    if (tileStatus === 'failure') {
      setError(__('Failed to add your data. Your data might be invalid format.'));
    }
  }, [tileStatus]);

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

    if (
      !acceptedFiles[0].name.endsWith('.geojson') &&
      !acceptedFiles[0].name.endsWith('.json') &&
      !acceptedFiles[0].name.endsWith('.csv')
    ) {
      setError(__('Error: We currently support GeoJSON and CSV files. Please try uploading again.'));
      return;
    }

    if (acceptedFiles[0].size > maxUploadSize) {
      setError(sprintf(__('Error: The file you selected was too big. Please upload a file less than %d MB.'), maxUploadSize / 1000000));
      return;
    }
    setError(null);
    setTileStatus('progress'); // NOTE: 最初のレスポンスまでに時間がかかるので、progress をセット。
    await sleep(50); // Just waiting for the visual effect of GVPProgress
    setGvpStep('uploading');
    try {
      await uploadGeoJson(acceptedFiles[0], session, teamId, geojsonId);
    } catch (error) {
      setGvpStep('started');
      throw error;
    }

    setGvpStep('processing');
    const status = await getTileStatus();
    setGvpStep('done');
    status === 'created' && await sleep(1500); // Just waiting for the visual effect of GVPProgress
    setTileStatus(status);
    setTimeout(() => setGvpStep('started'), 200); // // Just waiting and reset for the visual effect of GVPProgress

  }, [geojsonId, getTileStatus, maxUploadSize, session, setGvpStep, setTileStatus, teamId]);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});
  const mouseOverStyle = { background: isDragActive ? 'rgb(245, 245, 245)' : 'inherit' };

  return (
    <Paper className={'geojson-dropzone-container'}>
      <div className={'geojson-dropzone'} {...getRootProps()} style={mouseOverStyle}>
        <input {...getInputProps()} accept='.json,.geojson,.csv' />
        {isDragActive ? <p>{__('Drop file to add your map.')}</p> : (
          <>
            <CloudUploadIcon fontSize="large" />
            <p>
              {__('Upload a file from your computer.')}<br />
              {sprintf(__('Maximum upload file size: %d MB'), maxUploadSize / 1_000_000)}
            </p>
            <p>
              {__('Drag and drop a file here to add your map, or click to choose your file.')}<br />
            </p>
            { customMessage && <p>{customMessage}</p>}
          </>
        )}
        {error && !isDragActive && <div className="error">{error}</div>}
      </div>
    </Paper>
  );
};

export default Content;
