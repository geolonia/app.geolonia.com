import './APIKeys.scss';

import React, { useState, useCallback } from 'react';

import Table from '../custom/Table';
import AddNew2 from '../custom/AddNew2';
import Title from '../custom/Title';
import { CircularProgress } from '@material-ui/core';

import { sprintf, __ } from '@wordpress/i18n';
import moment from 'moment';

// redux
import { useHistory } from 'react-router';
import { useSelectedTeam } from '../../redux/hooks';
import { useCreateApiKeyMutation, useGetApiKeysQuery, useGetUserQuery } from '../../redux/apis/app-api';
import { useSession } from '../../hooks/session';

import dateParse from '../../lib/date-parse';
import mixpanel from 'mixpanel-browser';
import { sleep } from '../../lib/sleep';

const ApiKeys: React.FC = () => {
  const { push } = useHistory();
  const { userSub } = useSession();
  const { data: user, isSuccess: isUserSuccess } = useGetUserQuery({ userSub }, { skip: !userSub });
  const { selectedTeam } = useSelectedTeam();
  const teamId = selectedTeam?.teamId || '';
  const { data: mapKeys, isSuccess: isApiKeysSuccess } = useGetApiKeysQuery(teamId, {
    skip: !selectedTeam,
  });
  const isSuccess = isUserSuccess && isApiKeysSuccess;
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
    if (!user) return;
    const today = moment().format('YYYY-MM-DD');
    const name = sprintf(__('API Key (created by %1$s on %2$s)'), user.username, today);
    const result = await createApiKey({ teamId, name });
    if ('error' in result) {
      setMessage('Error');
      throw new Error();
    }
    const data = dateParse(result.data);
    mixpanel.track('Create API key', { apiKeyId: data.keyId });
    await sleep(1_000);
    push(`/api-keys/${data.keyId}`);
  }, [createApiKey, push, teamId, user]);

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
    disabled={!isSuccess}
    successMessage={__('A new API key has been created.')}
    errorMessage={message}
  />;

  return (
    <div>
      <Title breadcrumb={breadcrumbItems} title={__('API keys')}/>

      { !isSuccess ? <>
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
