import React, {useCallback, useEffect, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import Paper from '@material-ui/core/Paper';
import { GEOJSON_MAX_UPLOAD_SIZE } from '../../constants';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { __, sprintf } from '@wordpress/i18n';
import './ImportDropZone.scss';
import { useSelectedTeam } from '../../redux/hooks';
import { useUpdateLocationDataMutation } from '../../redux/apis/api';
import type { LSPageStatus } from './GeoJson/hooks/use-gvp';
import JSZip from 'jszip';

type Props = {
  geojsonId: string,
  customMessage?: string,
  lsPageStatus: LSPageStatus,
  setLSPageStatus: (lsPageStatus: LSPageStatus) => void
}

const ImportDropZone = (props: Props) => {
  const [error, setError] = useState<string | null>(null);
  const {
    geojsonId,
    customMessage,
    lsPageStatus,
    setLSPageStatus,
  } = props;
  const { selectedTeam } = useSelectedTeam();
  const teamId = selectedTeam?.teamId || '';
  const [uploadLocationData] = useUpdateLocationDataMutation();

  useEffect(() => {
    if (lsPageStatus === 'failed/uploadable') {
      setError(__('Failed to add your data. Your data might be invalid format.'));
    }
  }, [lsPageStatus]);

  const maxUploadSize = GEOJSON_MAX_UPLOAD_SIZE;

  const onDrop = useCallback( async (acceptedFiles: File[]) => {
    if (!teamId || !geojsonId) {
      setError(__('Error: Can not upload file. Please contact to customer support at https://geolonia.com/contact/'));
      return;
    }

    const shp = acceptedFiles.find((file) => file.name.endsWith('.shp'));
    const shx = acceptedFiles.find((file) => file.name.endsWith('.shx'));
    const dbf = acceptedFiles.find((file) => file.name.endsWith('.dbf'));
    const singleVector = acceptedFiles.find((file) => {
      return file.name.endsWith('.geojson') || file.name.endsWith('.json') || file.name.endsWith('.csv') || file.name.endsWith('.mbtiles');
    });

    const isShapefile = shp || shx || dbf;

    let uploadingFile: File;
    if (acceptedFiles.length === 0) {
      setError(__('Error: Please select at least one file.'));
      return;
    } else if (acceptedFiles.length === 1) {
      if (singleVector) {
        uploadingFile = singleVector;
      } else {
        if (isShapefile) {
          setError(__('Error: Some of the shapefiles seem to be missing.'));
        } else {
          setError(__('Error: We currently support GeoJSON, CSV, MBTiles and Shapefile files. Please try uploading again.'));
        }
        return;
      }
    } else {
      if (shp && shx && dbf) {
        const zip = new JSZip();
        for (const file of acceptedFiles) {
          zip.file(file.name, file);
        }
        const blob = await zip.generateAsync({type: 'blob'});
        uploadingFile = new File([blob], `${shp.name}.zip`, { type: 'application/zip' });
      } else {
        if (isShapefile) {
          setError(__('Error: Some of the shapefiles seem to be missing.'));
        } else {
          setError(__('Error: Can not upload multiple files.'));
        }
        return;
      }
    }

    if (uploadingFile.size > maxUploadSize) {
      setError(sprintf(__('Error: The file you selected was too big. Please upload a file less than %d MB.'), maxUploadSize / 1000000));
      return;
    }
    setError(null);
    setLSPageStatus('uploading');
    try {
      await uploadLocationData({locationDataFile: uploadingFile, teamId, geojsonId});
    } catch (error) {
      setLSPageStatus('failed/uploadable');
      throw error;
    }
    setLSPageStatus('processing');

  }, [geojsonId, maxUploadSize, setLSPageStatus, teamId, uploadLocationData]);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});
  const mouseOverStyle = { background: isDragActive ? 'rgb(245, 245, 245)' : 'inherit' };

  return (
    <Paper className={'geojson-dropzone-container'}>
      <div className={'geojson-dropzone'} {...getRootProps()} style={mouseOverStyle}>
        <input {...getInputProps()} accept='.json,.geojson,.csv,.mbtiles,.shp,.shx,.dbf,.prj' />
        {isDragActive ? <p>{__('Drop file to add your map.')}</p> : (
          <>
            <CloudUploadIcon fontSize="large" />
            <p style={{ textAlign: 'center' }}>
              {__('Upload a file from your computer.')}<br />
              {sprintf(__('Maximum upload file size: %d MB'), maxUploadSize / 1_000_000)}
            </p>
            <p style={{ textAlign: 'center' }}>
              {__('Drag and drop a file here to add your map, or click to choose your file.')}<br />
              {__('When uploading a shapefile, please select all associated files.')}
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
