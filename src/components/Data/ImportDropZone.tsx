import React, {useCallback, useEffect, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import Paper from '@material-ui/core/Paper';
import { GEOJSON_MAX_UPLOAD_SIZE } from '../../constants';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { __, sprintf } from '@wordpress/i18n';
import './ImportDropZone.scss';
import { sleep } from '../../lib/sleep';
import { useSelectedTeam } from '../../redux/hooks';
import { useUpdateLocationDataMutation } from '../../redux/apis/api';

type Props = {
  getTileStatus: () => Promise< Geolonia.TileStatus>,
  setTileStatus: (value: Geolonia.TileStatus) => void,
  setGvpStep: (value: Geolonia.GVPStep) => void,
  geojsonId?: string,
  customMessage?: string,
  tileStatus?: undefined | 'failure'
}

const ImportDropZone = (props: Props) => {
  const [error, setError] = useState<string | null>(null);
  const {
    geojsonId,
    customMessage,
    setTileStatus,
    setGvpStep,
    getTileStatus,
    tileStatus,
  } = props;
  const { selectedTeam } = useSelectedTeam();
  const teamId = selectedTeam?.teamId || '';
  const [uploadLocationData] = useUpdateLocationDataMutation();

  useEffect(() => {
    if (tileStatus === 'failure') {
      setError(__('Failed to add your data. Your data might be invalid format.'));
    }
  }, [tileStatus]);

  const maxUploadSize = GEOJSON_MAX_UPLOAD_SIZE;

  const onDrop = useCallback( async (acceptedFiles) => {
    if (!teamId || !geojsonId) {
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
      !acceptedFiles[0].name.endsWith('.csv') &&
      !acceptedFiles[0].name.endsWith('.mbtiles')
    ) {
      setError(__('Error: We currently support GeoJSON, CSV and MBTiles files. Please try uploading again.'));
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
      await uploadLocationData({locationDataFile: acceptedFiles[0], teamId, geojsonId});
      // TODO: エラーハンドリング
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

  }, [geojsonId, getTileStatus, maxUploadSize, setGvpStep, setTileStatus, teamId, uploadLocationData]);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});
  const mouseOverStyle = { background: isDragActive ? 'rgb(245, 245, 245)' : 'inherit' };

  return (
    <Paper className={'geojson-dropzone-container'}>
      <div className={'geojson-dropzone'} {...getRootProps()} style={mouseOverStyle}>
        <input {...getInputProps()} accept='.json,.geojson,.csv,.mbtiles' />
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

export default ImportDropZone;
