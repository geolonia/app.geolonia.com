import React, { useCallback, useEffect, useState } from 'react';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import LockIcon from '@material-ui/icons/Lock';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { CopyToClipboard } from '../custom/copy-to-clipboard';
import { __, sprintf } from '@wordpress/i18n';
import Save from '../custom/Save';
import { normalizeOrigins } from '@geolonia/utils';
import Interweave from 'interweave';
import { GetGeolonia } from '../custom/get-geolonia';
import './GeoJsonMeta.scss';
import { useSelectedTeam } from '../../redux/hooks';
import { useGetGeoJSONMetaQuery, useUpdateGeoJSONMetaMutation } from '../../redux/apis/api';
import { useGetApiKeysQuery } from '../../redux/apis/app-api';

type Props = {
  geojsonId: string;
};


const embedCSS = `.geolonia {
width: 100%;
height: 400px;
}`;

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
  height: '2.5rem',
  padding: '8px',
};



const usePublic = (geojsonId: string, isPublic: boolean): [boolean, (nextIsPublic: boolean) => void] => {
  const [draftIsPublic, setDraftIsPublic] = useState(isPublic);
  const [ updateGeoJSONMeta ] = useUpdateGeoJSONMetaMutation();

  useEffect(() => {
    if (isPublic === draftIsPublic) {
      return;
    }
    (async () => {
      const result = await updateGeoJSONMeta({ geojsonId, isPublic: draftIsPublic });
      if ('error' in result) {
        setDraftIsPublic(isPublic);
        throw result.error;
      }
    })();
  }, [draftIsPublic, geojsonId, isPublic, updateGeoJSONMeta]);

  return [draftIsPublic, setDraftIsPublic];
};

const useStatus = (geojsonId: string, status: string): [string, (nextStatus: string) => void] => {
  const [ draftStatus, setDraftStatus ] = useState(status);
  const [ updateGeoJSONMeta ] = useUpdateGeoJSONMetaMutation();

  useEffect(() => {
    if (status === draftStatus) {
      return;
    }
    (async () => {
      const result = await updateGeoJSONMeta({ geojsonId, status: draftStatus });
      if ('error' in result) {
        setDraftStatus(status);
        throw result.error;
      }
    })();
  },
  [draftStatus, geojsonId, status, updateGeoJSONMeta],
  );

  return [ draftStatus, setDraftStatus ];
};

const getApiKeyIdAllowedOrigins = (mapKeys: Geolonia.DateStringify<Geolonia.Key>[], apiKeyId: string | undefined) => {
  return mapKeys.find((key) => key.keyId === apiKeyId)?.allowedOrigins;
};

const getApiKeyIdUserKey = (mapKeys: Geolonia.DateStringify<Geolonia.Key>[], apiKeyId: string | undefined) => {
  return mapKeys.find((key) => key.keyId === apiKeyId)?.userKey;
};

const GeoJSONMeta = (props: Props) => {
  const { geojsonId } = props;
  const { selectedTeam } = useSelectedTeam();
  const teamId = selectedTeam?.teamId || '';
  const { data: geojsonMeta } = useGetGeoJSONMetaQuery({ geojsonId, teamId }, {
    skip: !selectedTeam,
  });
  const { data: mapKeys = [] } = useGetApiKeysQuery(teamId, {
    skip: !selectedTeam,
  });
  const [ updateGeoJSONMeta ] = useUpdateGeoJSONMetaMutation();

  const { allowedOrigins, name, primaryApiKeyId, isPublic, status } = geojsonMeta || {};

  // UI上での変更をリクエスト前まで保持しておくための State
  const [draftIsPublic, setDraftIsPublic] = usePublic(geojsonId, isPublic || false);
  const [draftStatus, setDraftStatus] = useStatus(geojsonId, status || '');
  const [draftName, setDraftName] = useState(name);
  const [draftAllowedOrigins, setDraftAllowedOrigins] = useState('');

  const [saveStatus, setSaveStatus] = useState<false | 'requesting' | 'success' | 'failure'>(false);
  const onRequestError = () => setSaveStatus('failure');

  const [apiKeyId, setApiKeyId] = useState(primaryApiKeyId);
  const [apiKeyIdAllowedOrigins, setApiKeyIdAllowedOrigins] = useState<string[] | undefined>([]);
  const [userKey, setUserKey] = useState<string | undefined>('');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://geolonia.github.io/get-geolonia/app.js';
    document.body.appendChild(script);
  }, []);

  // effects
  useEffect(() => {
    if (allowedOrigins) {
      setDraftAllowedOrigins(allowedOrigins.join('\n'));
    }
  }, [allowedOrigins]);

  useEffect(() => {
    const allowedOrigins = getApiKeyIdAllowedOrigins(mapKeys, primaryApiKeyId);
    setApiKeyIdAllowedOrigins(allowedOrigins);

    const userKey = getApiKeyIdUserKey(mapKeys, primaryApiKeyId);
    setUserKey(userKey);

  }, [mapKeys, primaryApiKeyId]);

  // control the Accordion
  const [expanded, setExpanded] = useState<boolean | undefined>(undefined);
  useEffect(() => {
    if (allowedOrigins && allowedOrigins.length > 0 && expanded === undefined) {
      setExpanded(true);
    }
  }, [allowedOrigins, expanded]);
  const handleExpandClick = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setExpanded((expanded) => !expanded);
  }, []);

  // fire save name request
  const handleGeoJSONMetaSubmit = useCallback<(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>>(async () => {

    if (!draftName) {
      return;
    }

    const result = await updateGeoJSONMeta({ name: draftName, geojsonId });
    if ('error' in result) {
      throw result.error;
    }
  }, [draftName, geojsonId, updateGeoJSONMeta]);

  let saveDisabled = false;

  if (allowedOrigins) {
    saveDisabled = draftAllowedOrigins === allowedOrigins.join('\n');
  }

  const handleGeoJSONMetaAllowedOriginsSubmit = useCallback(async () => {
    if (saveDisabled) {
      return;
    }
    setSaveStatus('requesting');
    const normalizedAllowedOrigins = normalizeOrigins(draftAllowedOrigins);
    const result = await updateGeoJSONMeta({geojsonId, allowedOrigins: normalizedAllowedOrigins});
    if ('error' in result) {
      setSaveStatus('failure');
      throw result.error;
    } else {
      setSaveStatus('success');
    }
  }, [draftAllowedOrigins, geojsonId, saveDisabled, updateGeoJSONMeta]);

  const handleGeoJSONMetaPrimaryApiKeySubmit = useCallback(async (primaryApiKeyId: string) => {
    const result = await updateGeoJSONMeta({geojsonId, primaryApiKeyId});
    if ('error' in result) {
      throw new Error('HTTP error');
    }
  }, [geojsonId, updateGeoJSONMeta]);

  const handleSelectApiKey = useCallback((event: React.ChangeEvent<{ value: unknown }>) => {
    if (!mapKeys) {
      return;
    }
    const primaryApiKeyId = event.target.value as string;
    const allowedOrigins = getApiKeyIdAllowedOrigins(mapKeys, primaryApiKeyId);
    const userKey = getApiKeyIdUserKey(mapKeys, primaryApiKeyId);

    handleGeoJSONMetaPrimaryApiKeySubmit(primaryApiKeyId);

    setApiKeyId(primaryApiKeyId);
    setUserKey(userKey);
    setApiKeyIdAllowedOrigins(allowedOrigins);
  }, [mapKeys, handleGeoJSONMetaPrimaryApiKeySubmit]);

  const stage = process.env.REACT_APP_STAGE === 'v1' ? 'v1' : 'dev';
  const embedCode = sprintf(
    '<script type="text/javascript" src="%s/%s/embed?geolonia-api-key=%s"></script>',
    'https://cdn.geolonia.com', // `api.geolonia.com/{stage}/embed` has been deprecated.
    stage,
    userKey,
  );

  return (
    <Grid className="geojson-meta" container spacing={2}>
      <Grid item sm={4} xs={12}>
        <Paper className="geojson-title-description">
          <h3>{__('Name')}</h3>
          <input
            type="text"
            value={draftName}
            onChange={(e) => setDraftName(e.currentTarget.value)}
          />
          <Save
            onClick={handleGeoJSONMetaSubmit}
            disabled={draftName === name}
          />
        </Paper>
        <Paper className="geojson-title-description">
          <div>
            <Switch
              checked={draftIsPublic}
              onChange={(e) => {
                setDraftIsPublic(e.target.checked);
              }}
              // NOTE: Billing feature
              inputProps={{ 'aria-label': 'primary checkbox' }}
              color="primary"
            />
            {isPublic ? (
              <span className="is-public">
                <LockOpenIcon fontSize="small" />
                Public
              </span>
            ) : (
              <span className="is-public">
                <LockIcon fontSize="small" />
                Private
              </span>
            )}
          </div>
          <div>
            {/* NOTE: Billing feature */}
            {/* {isPublic ? ( */}
            <p>
              {__(
                'Public features will be displayed publicly and anyone can download this features without API key.',
              )}
            </p>
            {/* ) : (
              <p>
                {__("You can restrict the URLs that can use this Location Data.")}
              </p>
            )} */}

            <Switch
              checked={draftStatus === 'published'}
              onChange={() => {
                setDraftStatus(
                  draftStatus === 'published' ? 'draft' : 'published',
                );
              }}
              inputProps={{ 'aria-label': 'primary checkbox' }}
              color="primary"
            />
            {draftStatus === 'published' ? (
              <span className="is-public">
                <DoneIcon fontSize="small" />
                Published
              </span>
            ) : (
              <span className="is-public">
                <EditIcon fontSize="small" />
                Draft
              </span>
            )}

            {status === 'published' ? (
              <p>{__('Datasets are published now.')}</p>
            ) : (
              <p>{__('Datasets status are draft now.')}</p>
            )}
            {/* NOTE: Billing feature */}
            {/* <p>
              <a href="#/team/billing">{__("Upgrade to Geolonia Team")}</a>
            </p> */}
          </div>
        </Paper>
        {draftIsPublic && (
          <Accordion className="geojson-title-description geojson-advanced-settings" expanded={!!expanded}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              onClick={handleExpandClick}
            >
              <h3>{__('Advanced Settings')}</h3>
            </AccordionSummary>
            <AccordionDetails>
              <Grid>
                <h4>{__('Access allowed URLs')}</h4>
                <p>{__('If you want to add more URLs to the "URLs to allow access" set on the API key page, please use the following settings. (e.g., if you want to use multiple API keys for a single tile, etc.)')}</p>
                {apiKeyId &&
                  <>
                    <h5>{__('URLs from API Key page.')}</h5>
                    <ul className={'geojson-api-key-allowed-url'}>
                      {apiKeyIdAllowedOrigins && apiKeyIdAllowedOrigins.map((allowedOrigin, index) => <li key={index}><code>{allowedOrigin}</code></li>)}
                    </ul>
                  </>
                }
                <h5>{__('Enter URLs to be added.')}</h5>
                <TextField
                  id="standard-name"
                  multiline={true}
                  rows={5}
                  placeholder="https://example.com"
                  fullWidth={true}
                  value={draftAllowedOrigins}
                  onChange={(e) => setDraftAllowedOrigins(e.target.value)}
                  disabled={saveStatus === 'requesting'}
                  variant="outlined"
                />
                <Save
                  onClick={handleGeoJSONMetaAllowedOriginsSubmit}
                  onError={onRequestError}
                  disabled={saveDisabled}
                />
              </Grid>
            </AccordionDetails>
          </Accordion>
        )}
      </Grid>
      <Grid item sm={8} xs={12}>
        <Paper style={sidebarStyle}>
          <Typography component="h2" className="module-title">
            {__('Add the map to your site')}
          </Typography>
          <Typography component="h3" style={styleH3}>
            {__('Step 1')}
          </Typography>
          <p>{__('Please select API key.')}</p>
          <FormControl fullWidth={true}>
            <InputLabel id="api-key-select-label">{__('API key')}</InputLabel>
            <Select
              labelId="api-key-select-label"
              id="api-key-select"
              value={mapKeys.length > 0 ? (apiKeyId || '') : ''} // NOTE: value should match one of the option values, so wait mapKeys arrives
              onChange={handleSelectApiKey}
            >
              <MenuItem value="">
                <em>{__('None')}</em>
              </MenuItem>
              {mapKeys.map((key) => <MenuItem key={key.keyId} value={key.keyId}>{key.name}</MenuItem>)}
            </Select>
            <FormHelperText>
              <Interweave
                content={__('If you don\'t have one, create it from <a href=\'#/api-keys\'>API Keys</a>.')}
              />
            </FormHelperText>
          </FormControl>
          <Typography component="h3" style={styleH3}>
            {__('Step 2')}
          </Typography>
          <p>
            <Interweave
              content={__(
                'Include the following code <strong>before closing tag of the <code>&lt;body /&gt;</code><strong> in your HTML file.',
              )}
            />
          </p>
          <textarea
            id={'location-service__embed-script'}
            style={styleTextarea}
            value={embedCode}
            readOnly={true}
          ></textarea>
          <CopyToClipboard value={embedCode} target={'location-service__embed-script'} />
          <Typography component="h3" style={styleH3}>
            {__('Step 3')}
          </Typography>
          <p>
            {__(
              'Click following button and get HTML code where you want to place the map.',
            )}
          </p>
          <p>
            <GetGeolonia geojsonId={geojsonId} marker={'off'} />
          </p>
          <Typography component="h3" style={styleH3}>
            {__('Step 4')}
          </Typography>
          <p>{__('Adjust the element size.')}</p>
          <textarea
            id="location-service__embed-css"
            style={styleTextarea}
            value={embedCSS}
            readOnly={true}
          ></textarea>
          <CopyToClipboard value={embedCSS} target={'location-service__embed-css'} />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default GeoJSONMeta;
