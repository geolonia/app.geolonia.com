import React, { useCallback, useEffect, useState } from 'react';

// components
import AddNew from '../custom/AddNew';
import Title from '../custom/Title';
import { CircularProgress } from '@material-ui/core';

// utils
import { __ } from '@wordpress/i18n';
import Moment from 'moment';
import Table from '../custom/Table';
import { useSelectedTeam } from '../../redux/hooks';
import { useGetGeoJSONMetaCollectionQuery, useCreateGeoJSONMetaMutation } from '../../redux/apis/api';
import mixpanel from 'mixpanel-browser';
import { sleep } from '../../lib/sleep';

type OwnProps = Record<string, never>;
type RouteProps = {
  location: {
    search: string;
  };
  history: {
    push: (href: string) => void;
  };
};
type Props = OwnProps & RouteProps;

type typeTableRows = {
  id: string;
  name: string;
  updated: string;
  isPublic?: boolean | undefined;
};

function GeoJsons(props: Props) {
  const [message, setMessage] = useState('');
  const [rows, setRows] = useState<typeTableRows[]>([]);

  const { selectedTeam } = useSelectedTeam();
  const teamId = selectedTeam?.teamId || '';
  const { data: geojsons, isFetching, isError } = useGetGeoJSONMetaCollectionQuery(teamId, {
    skip: !selectedTeam,
  });
  const [ createGeoJSONMeta ] = useCreateGeoJSONMetaMutation();
  const { history } = props;

  useEffect(() => {
    if (!teamId || !geojsons) {
      return;
    }

    if (isError) {
      alert(__('Network Error.'));
      return;
    }

    const rows = [];
    for (let i = 0; i < geojsons.length; i++) {
      // const item = dateParse<DateStringify<any>>(json[i]);
      const geojson = geojsons[i];
      rows.push({
        id: geojson.id,
        name: geojson.name,
        updated: Moment(geojson.updateAt).format(),
        isPublic: geojson.isPublic,
      } as typeTableRows);
    }
    rows.sort((a: typeTableRows, b: typeTableRows) => {
      if (a.updated > b.updated) {
        return -1;
      } else {
        return 1;
      }
    });
    setRows(rows);
  }, [geojsons, isError, teamId]);

  const breadcrumbItems = [
    {
      title: __('Home'),
      href: '#/',
    },
    {
      title: __('Map'),
      href: null,
    },
  ];

  const handleNewGeoJSONMeta = useCallback(async (name: string) => {
    const result = await createGeoJSONMeta({teamId, name});
    if ('error' in result) {
      setMessage('Error');
      throw new Error();
    }
    const geojsonId = result.data.id;
    mixpanel.track('Create Dataset', { geojsonId });
    await sleep(1_000);
    history.push(`/data/geojson/${geojsonId}`);
  }, [createGeoJSONMeta, history, teamId]);
  console.log({rows});
  return (
    <div>
      <Title breadcrumb={breadcrumbItems} title={__('Location Data')}>
        {__(
          'Location Data is an service for hosting location data. Register various location information data such as stores and real estate information that you have.',
        )}
      </Title>

      <AddNew
        label={__('Create a new dataset')}
        description={__('Please enter the name of the new dataset.')}
        defaultValue={__('My dataset')}
        onClick={handleNewGeoJSONMeta}
        errorMessage={message}
      />

      {isFetching ? (
        <CircularProgress />
      ) : (
        <Table
          rows={rows}
          rowsPerPage={10}
          permalink="/data/geojson/%s"
        />
      )}
    </div>
  );
}

export default GeoJsons;
