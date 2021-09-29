import React, { useCallback, useEffect, useState } from 'react';


import Delete from '../custom/Delete';
import DangerZone from '../custom/danger-zone';

import Title from '../custom/Title';
import MapEditorElement from './MapEditorElement';
// import ExportButton from "./ExportButton";
import GeoJsonMeta from './GeoJsonMeta';

// lib
import { __ } from '@wordpress/i18n';
import { sleep } from '../../lib/sleep';
import { useHistory, useRouteMatch } from 'react-router';

import './GeoJson.scss';
// constants
import { messageDisplayDuration } from '../../constants';
import { useGetGeoJSONMetaQuery, useDeleteGeoJSONMetaMutation } from '../../redux/apis/api';
import { useSelectedTeam } from '../../redux/hooks';

type Props = Record<string, never>;

const GeoJson: React.FC<Props> = () => {

  const history = useHistory();
  const match = useRouteMatch<{id: string}>();
  const geojsonId = match.params.id;

  const { selectedTeam } = useSelectedTeam();
  const teamId = selectedTeam?.teamId || '';

  const { data: geoJsonMeta } = useGetGeoJSONMetaQuery({ geojsonId, teamId }, {
    skip: !selectedTeam,
  });
  const [deleteGeoJSONMeta] = useDeleteGeoJSONMetaMutation();

  const [message] = useState('');

  // move on team change
  const [prevTeamId, setPrevTeamId] = useState<string | null>(null);
  useEffect(() => {
    if (!prevTeamId && !!teamId) {
      setPrevTeamId(teamId);
    } else if (prevTeamId !== teamId) {
      history.push('/data/geojson');
    }
  }, [history, prevTeamId, teamId]);

  const breadcrumbItems = [
    {
      title: __('Home'),
      href: '#/',
    },
    {
      title: __('Map'),
      href: null,
    },
    {
      title: __('Location Data'),
      href: '#/data/geojson',
    },
  ];

  const handleDeleteGeoJSONMeta = useCallback(async () => {
    if (!teamId || !geojsonId) {
      return Promise.resolve();
    }
    await deleteGeoJSONMeta({teamId, geojsonId});
    await sleep(messageDisplayDuration);
    history.push('/data/geojson');
  }, [deleteGeoJSONMeta, geojsonId, history, teamId]);

  // invalid url entered
  if (geoJsonMeta && geoJsonMeta.teamId !== teamId) {
    return null;
  }
  // if (error) {
  //   return null;
  // }

  return (
    <div className="gis-panel">
      <Title
        breadcrumb={breadcrumbItems}
        title={geoJsonMeta ? geoJsonMeta.name : ''}
      >
        {__(
          'Upload your location data here to display it on a map. Once the data has been uploaded, HTML code will be generated so you can embed it in your site. We currently support uploading GeoJSON, CSV and MBTiles files.',
        )}
      </Title>

      <MapEditorElement geojsonId={geojsonId} />

      { geoJsonMeta && <div className="geojson-meta">
        <GeoJsonMeta geojsonId={geojsonId} />
      </div>}

      <DangerZone
        whyDanger={__(
          'Once you delete an Dataset, there is no going back. Please be certain.',
        )}
      >
        <Delete
          text1={__('Are you sure you want to delete this Dataset?')}
          text2={__('Please type delete to confirm.')}
          answer={geoJsonMeta ? geoJsonMeta.name : void 0}
          errorMessage={message}
          onClick={handleDeleteGeoJSONMeta}
        />
      </DangerZone>
    </div>
  );
};

export default GeoJson;
