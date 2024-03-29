import React, { useState, useEffect, useCallback, useRef } from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';

import { sprintf, __ } from '@wordpress/i18n';
import Interweave from 'interweave';

import Code from '../custom/Code';
import Save from '../custom/Save';
import Delete from '../custom/Delete';
import Help from '../custom/Help';
import Title from '../custom/Title';
import DangerZone from '../custom/danger-zone';
import { GetGeolonia } from '../custom/get-geolonia';
import { CopyToClipboard } from '../custom/copy-to-clipboard';

// libs
import { normalizeOrigins } from '@geolonia/utils';

// constants
import { messageDisplayDuration } from '../../constants';
import { sleep } from '../../lib/sleep';
import mixpanel from 'mixpanel-browser';
import { Redirect, useHistory, useRouteMatch } from 'react-router';
import { useDeleteApiKeyMutation, useGetApiKeysQuery, useUpdateApiKeyMutation } from '../../redux/apis/app-api';
import { useSelectedTeam } from '../../redux/hooks';
import { CircularProgress } from '@material-ui/core';
import HiddenCode from '../custom/HiddenCode';

interface ApiKeyFormControlsCollection extends HTMLFormControlsCollection {
  apiKeyName: HTMLInputElement
  apiKeyAllowedOrigins: HTMLInputElement
}

const ApiKey: React.FC = () => {
  const history = useHistory();
  const match = useRouteMatch<{id: string}>();
  const { selectedTeam } = useSelectedTeam();
  const teamId = selectedTeam?.teamId || '';
  const { data: mapKeys, isLoading } = useGetApiKeysQuery(teamId, {
    skip: !selectedTeam,
  });
  const mapKey = mapKeys?.find((mapKey) => mapKey.keyId === match.params.id);

  const [ updateKey ] = useUpdateApiKeyMutation();
  const [ deleteKey ] = useDeleteApiKeyMutation();

  const apiKey = mapKey?.userKey;
  const secretKey = mapKey?.secretKey || '';
  const keyId = mapKey?.keyId;
  // props
  const propName = (mapKey || { name: '' }).name;
  const propOrigins = (mapKey || { allowedOrigins: [] }).allowedOrigins;

  // state
  const [status, setStatus] = useState<
    false | 'requesting' | 'success' | 'failure'
  >(false);
  const [message, setMessage] = useState('');

  const apiKeyFormRef = useRef<HTMLFormElement | null>(null);

  // effects
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://geolonia.github.io/get-geolonia/app.js';
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const onNameBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const name = e.currentTarget.value;
    e.currentTarget.value = name.trim();
  }, []);

  const embedCode = sprintf(
    '<script type="text/javascript" src="%s/%s/embed?geolonia-api-key=%s"></script>',
    'https://cdn.geolonia.com', // `api.geolonia.com/{stage}/embed` has been deprecated.
    process.env.REACT_APP_STAGE,
    apiKey,
  );
  const embedCSS = '.geolonia {\n  width: 100%;\n  height: 400px;\n}';

  const breadcrumbItems = [
    {
      title: __('Home'),
      href: '#/',
    },
    {
      title: __('API keys'),
      href: '#/api-keys',
    },
  ];

  const styleH3: React.CSSProperties = {
    marginTop: '1em',
  };

  const sidebarStyle: React.CSSProperties = {
    marginBottom: '2em',
    overflowWrap: 'break-word',
  };

  const styleTextarea: React.CSSProperties = {
    width: '100%',
    color: '#555555',
    fontFamily: 'monospace',
    resize: 'none',
    height: '5rem',
    padding: '8px',
  };

  const apiKeyArea: React.CSSProperties = {
    marginBottom: '10px',
  };

  const handleApiKeySubmit = useCallback<(event?: React.FormEvent<HTMLFormElement>) => Promise<void>>(async (event) => {
    if (!keyId || !apiKeyFormRef.current) {
      return;
    }
    if (event) {
      event.preventDefault();
    }

    setStatus('requesting');

    const elements = apiKeyFormRef.current.elements as ApiKeyFormControlsCollection;
    const allowedOrigins = elements['apiKeyAllowedOrigins'].value;
    const name = elements['apiKeyName'].value;

    const normalizedAllowedOrigins = normalizeOrigins(allowedOrigins);

    // Immediate feedback for normalization
    elements['apiKeyAllowedOrigins'].value = normalizedAllowedOrigins.join('\n');

    const nextKey = {
      name,
      allowedOrigins: normalizedAllowedOrigins,
    };

    const result = await updateKey({teamId, keyId, updates: nextKey});
    if ('error' in result) {
      setStatus('failure');
      setMessage(__('An unexpected error occurred. Please try again.'));
      throw new Error(JSON.stringify(result));
    }
    mixpanel.track('Update API key', {
      apiKeyId: keyId,
      originCount: normalizedAllowedOrigins.length,
    });
    setStatus('success');
  }, [keyId, teamId, updateKey]);

  const onUpdateClick = useCallback<() => Promise<void>>(async () => {
    await handleApiKeySubmit();
  }, [handleApiKeySubmit]);

  const onRequestError = useCallback(() => setStatus('failure'), []);

  const onDeleteClick = useCallback<() => Promise<void>>(async () => {
    if (!keyId) return;

    setStatus('requesting');
    await deleteKey({teamId, keyId});
    // if (result.error) {
    //   setStatus('failure');
    //   setMessage(result.message);
    //   throw new Error(result.code);
    // }
    setStatus('success');
    mixpanel.track('Delete API key', { apiKeyId: keyId });
    await sleep(messageDisplayDuration);

    history.push('/api-keys');
  }, [deleteKey, history, keyId, teamId]);

  if (isLoading || !Array.isArray(mapKeys)) {
    return <CircularProgress />;
  }

  if (Array.isArray(mapKeys) && (!mapKey || !apiKey || mapKey.isDeleted)) {
    // no key found
    return <Redirect to="/api-keys" />;
  }

  return (
    <div>
      <Title breadcrumb={breadcrumbItems} title={__('API key')}>
        {__(
          'Configure access control for your API key and Get the HTML code for your map.',
        )}
      </Title>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>

          <Paper style={apiKeyArea}>
            <Typography component="h2" className="module-title">
              {__('Your API Key')}
            </Typography>

            <Code>{apiKey || ''}</Code>

            <HiddenCode
              labelText={__('Secret API Key')}
              value={secretKey}
              helperText={__('Use this key to interact with authenticated APIs.')}
            />
          </Paper>

          <Paper>
            <form onSubmit={handleApiKeySubmit} ref={apiKeyFormRef}>
              <Typography component="h2" className="module-title">
                {__('Settings')}
              </Typography>

              <TextField
                label={__('Name for managing API keys')}
                name="apiKeyName"
                margin="normal"
                fullWidth={true}
                defaultValue={propName}
                disabled={status === 'requesting'}
                onBlur={onNameBlur}
              />

              <TextField
                label={__('List of URLs that are allowed to display the map')}
                name="apiKeyAllowedOrigins"
                helperText={__('Enter multiple URLs on new lines. You cannot specify a path in the URL.')}
                margin="normal"
                multiline={true}
                rows={5}
                placeholder="https://example.com"
                fullWidth={true}
                defaultValue={propOrigins.join('\n')}
                disabled={status === 'requesting'}
              />

              <Save
                onClick={onUpdateClick}
                onError={onRequestError}
                disabled={false}
              />

              <Help>
                <Typography component="p">
                  {__(
                    'This API key can only be used to display maps on the websites listed above.',
                  )}
                </Typography>
                <p>
                  <Interweave
                    content={__('The <a href="https://docs.geolonia.com/tutorial/002/#your-api-key-%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6" target="_blank" rel="noopener noreferrer">websites allowed by <code>YOUR-API-KEY</code></a> are automatically added to this list. Requests from these websites are free, and are not counted towards your map view quota.')}
                  />
                </p>
                <ul>
                  <li>
                    {__('Any page in a specific URL:')}{' '}
                    <strong>https://www.example.com</strong>
                  </li>
                  <li>
                    {__('Any subdomain:')} <strong>https://*.example.com</strong>
                  </li>
                  <li>
                    {__('A URL with a non-standard port:')}{' '}
                    <strong>https://example.com:*</strong>
                  </li>
                </ul>
                <p>
                  {__(
                    'Note: The wildcard character (*) will be matched to a-z, A-Z, 0-9, "-", "_". You may use multiple wildcards in one URL.',
                  )}
                </p>
              </Help>

            </form>
          </Paper>

          <DangerZone
            whyDanger={__(
              'Once you delete an API, there is no going back. Please be certain.',
            )}
          >
            <Delete
              text1={__('Are you sure you want to delete this API key?')}
              text2={__('Please type delete to confirm.')}
              errorMessage={message}
              onClick={onDeleteClick}
              onFailure={onRequestError}
              // disable buttons before page move on success
              disableCancel={(status) => status === 'success'}
              disableDelete={(input, status) => {
                return input !== 'delete' || status === 'success';
              }}
            />
          </DangerZone>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper style={sidebarStyle}>
            <Typography component="h2" className="module-title">
              {__('Add the map to your site')}
            </Typography>
            <Typography component="h3" style={styleH3}>
              {__('Step 1')}
            </Typography>
            <p>
              <Interweave
                content={__(
                  'Include the following code <strong>before closing tag of the <code>&lt;body /&gt;</code><strong> in your HTML file.',
                )}
              />
            </p>
            <textarea
              id={'api-key__embed-script'}
              style={styleTextarea}
              value={embedCode}
              readOnly={true}
            ></textarea>
            <CopyToClipboard value={ embedCode } target={'api-key__embed-script'} />
            <Typography component="h3" style={styleH3}>
              {__('Step 2')}
            </Typography>
            <p>
              {__(
                'Click following button and get HTML code where you want to place the map.',
              )}
            </p>
            <p>
              <GetGeolonia
                defaultXYZ={[139.6503, 35.6762, 10]}
                mapStyle={'geolonia/basic-v1'}
              />
            </p>
            <Typography component="h3" style={styleH3}>
              {__('Step 3')}
            </Typography>
            <p>{__('Adjust the element size.')}</p>
            <textarea
              id={'api-key__embed-css'}
              style={styleTextarea}
              value={embedCSS}
              readOnly={true}
            ></textarea>
            <CopyToClipboard value={ embedCSS } target={'api-key__embed-css'} />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default ApiKey;
