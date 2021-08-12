import React, { useState, useCallback } from 'react';

import Table from '../custom/Table';
import AddNew2 from '../custom/AddNew2';
import Title from '../custom/Title';

import { sprintf, __ } from '@wordpress/i18n';
import { connect } from 'react-redux';
import moment from 'moment';

// api
import createKey from '../../api/keys/create';

// redux
import Redux from 'redux';
import { createActions as createMapKeyActions } from '../../redux/actions/map-key';
import dateParse from '../../lib/date-parse';
import mixpanel from 'mixpanel-browser';

import './APIKeys.scss';

type OwnProps = Record<string, never>;
type StateProps = {
  session: Geolonia.Session;
  mapKeys: Geolonia.Key[];
  error: boolean;
  teamId: string;
  username: string;
};
type DispatchProps = {
  addKey: (teamId: string, key: Geolonia.Key) => void;
};
type RouterProps = {
  history: { push: (path: string) => void };
};
type Props = OwnProps & StateProps & DispatchProps & RouterProps;

function ApiKeys(props: Props) {
  const { mapKeys, username, addKey, session, teamId, history: { push } } = props;
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

  const handler = useCallback(async (name: string) => {
    const result = await createKey(session, teamId, name);
    if (result.error) {
      setMessage(result.message);
      throw new Error(result.code);
    }
    const data = dateParse(result.data);
    addKey(teamId, data);
    mixpanel.track('Create API key', { apiKeyId: result.data.keyId });
    return result.data;
  }, [addKey, session, teamId]);

  const rows = mapKeys.map((key) => {
    return {
      id: key.keyId,
      name: key.name,
      updated: key.createAt
        ? key.createAt.format('YYYY/MM/DD hh:mm:ss')
        : __('(No date)'),
    };
  });

  const newAPIButton = <AddNew2
    buttonLabel={__('New')}
    onClick={async () => {
      const today = moment().format('YYYY-MM-DD');
      const newKeyName = sprintf(__('API Key (created by %1$s on %2$s)'), username, today);
      return handler(newKeyName).then((key) => push(`/api-keys/${key.keyId}`));
    }}
    successMessage={__('A new API key has been created.')}
    errorMessage={message}
  />;

  return (
    <div>
      <Title breadcrumb={breadcrumbItems} title={__('API keys')}/>

      {mapKeys.length === 0 ? <div className={'tutorial-create-api-key'}>
        <h3>{__('You need an API key to display map. Get an API key.')}</h3>
        {newAPIButton}
      </div>
        :
        newAPIButton
      }

      <Table rows={rows} rowsPerPage={10} permalink="/api-keys/%s" />
    </div>
  );
}

const mapStateToProps = (state: Geolonia.Redux.AppState): StateProps => {
  const { session } = state.authSupport;
  const { data: teams, selectedIndex } = state.team;
  const teamId = teams[selectedIndex] && teams[selectedIndex].teamId;
  const { data: mapKeys = [], error = false } = state.mapKey[teamId] || {};
  const username = state.userMeta.name;

  return { session, mapKeys, error, teamId, username };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch) => {
  return {
    addKey: (teamId: string, key: Geolonia.Key) =>
      dispatch(createMapKeyActions.add(teamId, key)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ApiKeys);
