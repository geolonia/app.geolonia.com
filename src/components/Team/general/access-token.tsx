import React, { useState, useCallback, useContext } from 'react';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { __ } from '@wordpress/i18n';
import { CircularProgress } from '@material-ui/core';
import { context as NotificationContext} from '../../../contexts/notification';

// constant
import { useGenerateTeamAccessTokenMutation } from '../../../redux/apis/app-api';
import { useSelectedTeam } from '../../../redux/hooks';

const paragraphStyle = {
  marginTop: '1em',
} as React.CSSProperties;

export const AccessToken: React.FC<{}> = () => {

  const { selectedTeam } = useSelectedTeam();
  const teamId = selectedTeam?.teamId || '';

  const [generateAccessToken, { isLoading: isAccessTokenGenerating }] = useGenerateTeamAccessTokenMutation();
  const [generatedAccessToken, setGeneratedAccessToken] = useState('');
  const { updateState: updateNotificationState } = useContext(NotificationContext);

  const tokenValue = generatedAccessToken || (
    selectedTeam?.hasAccessToken ? 'not available.' // shown as ***** in type=password input
      : '');

  const regenerateAccessToken = useCallback(async () => {
    if (teamId) {
      const result = await generateAccessToken({ teamId });
      if ('error' in result || (!result.data.success && !result.data.accessToken)) {
        updateNotificationState({ open: true, message: __('Unknown Error.'), type: 'failure' });
      } else {
        setGeneratedAccessToken(result.data.accessToken);
      }
    }
  }, [generateAccessToken, teamId, updateNotificationState]);

  return <div className="grid-item-container">
    <Typography component="h2" className="module-title">
      {__('API Access')}
    </Typography>
    {
      (selectedTeam?.hasAccessToken || regenerateAccessToken) && <TextField
        id="access-token"
        label={__('Access Token')}
        type={generatedAccessToken ? 'text' : 'password'}
        margin="normal"
        fullWidth={true}
        value={tokenValue}
        disabled={true}
      />
    }
    <Typography style={paragraphStyle} paragraph={true} component="p">
      <Button
        variant="contained"
        color="default"
        onClick={regenerateAccessToken}
        disabled={isAccessTokenGenerating || !teamId}
      >
        { isAccessTokenGenerating && <CircularProgress size={16} style={{ marginRight: 8 }} />}
        {selectedTeam?.hasAccessToken ? __('Re-issue an access token') : __('Issue an access token')}
      </Button>
      <p className="mute">
        {__('For security reasons, the access token is only displayed when issued. Re-issuing will invalidate the previous access token.')}
      </p>
    </Typography>
  </div>;
};

export default AccessToken;
