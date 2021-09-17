import React, { useState, useCallback } from 'react';

import Table from '../custom/Table';
import AddNew2 from '../custom/AddNew2';
import Title from '../custom/Title';

import { sprintf, __ } from '@wordpress/i18n';
import moment from 'moment';

// redux
import dateParse from '../../lib/date-parse';
import mixpanel from 'mixpanel-browser';

import './APIKeys.scss';
import { useHistory } from 'react-router';
import { useAppSelector, useSelectedTeam } from '../../redux/hooks';
import { useCreateApiKeyMutation, useGetApiKeysQuery } from '../../redux/apis/app-api';
import { sleep } from '../../lib/sleep';
import { CircularProgress } from '@material-ui/core';

const ApiKeys: React.FC = () => {
  const { push } = useHistory();
  const username = useAppSelector((state) => state.userMeta.name);
  const { selectedTeam } = useSelectedTeam();
  const teamId = selectedTeam?.teamId || '';
  const { data: mapKeys, isFetching } = useGetApiKeysQuery(teamId, {
    skip: !selectedTeam,
  });
  const [ createApiKey ] = useCreateApiKeyMutation();
  const [message, setMessage] = useState('');
  const breadcrumbItems = [
    {
      title: __('Home'),
      href: '#/',
    },
    {
      title: __('API keys'),
      href: null,
    },
  ];

  const handleNewApiKey = useCallback<() => Promise<void>>(async () => {
    const today = moment().format('YYYY-MM-DD');
    const name = sprintf(__('API Key (created by %1$s on %2$s)'), username, today);
    const result = await createApiKey({ teamId, name });
    if ('error' in result) {
      setMessage('Error');
      throw new Error();
    }
    const data = dateParse(result.data);
    mixpanel.track('Create API key', { apiKeyId: data.keyId });
    await sleep(1_000);
    push(`/api-keys/${data.keyId}`);
  }, [createApiKey, push, teamId, username]);

  const rows = (mapKeys || []).map((key) => {
    return {
      id: key.keyId,
      name: key.name,
      updated: key.createAt
        ? moment(key.createAt).format('YYYY/MM/DD HH:mm:ss')
        : __('(No date)'),
    };
  });

  const newAPIButton = <AddNew2
    buttonLabel={__('New')}
    onClick={handleNewApiKey}
    successMessage={__('A new API key has been created.')}
    errorMessage={message}
  />;

  return (
    <div>
      <Title breadcrumb={breadcrumbItems} title={__('API keys')}/>

      { isFetching ? <>
        <CircularProgress />
      </> : <>
        {mapKeys && mapKeys.length === 0 ? <div className={'tutorial-create-api-key'}>
          <h3>{__('You need an API key to display map. Get an API key.')}</h3>
          {newAPIButton}
        </div>
          :
          newAPIButton
        }

        <Table rows={rows} rowsPerPage={10} permalink="/api-keys/%s" />
      </> }
    </div>
  );
};

export default ApiKeys;
