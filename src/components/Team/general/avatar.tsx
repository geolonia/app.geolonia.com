import React, { useState, useRef, useCallback } from 'react';

// Components
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import defaultTeamIcon from '../../custom/team.svg';
import { CircularProgress } from '@material-ui/core';
import Alert from '../../custom/Alert';

// utils
import { __, sprintf } from '@wordpress/i18n';

// constants
import { avatarLimitSize, Roles } from '../../../constants';

// redux
import { useSelectedTeam, useImageFromURL, useAppDispatch } from '../../../redux/hooks';
import { useUpdateTeamAvatarMutation } from '../../../redux/apis/app-api';
import { setAvatar } from '../../../redux/actions/avatar';

const ProfileImageStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '250px',
  height: 'auto',
  margin: '16px',
};

const Content: React.FC = () => {
  const dispatch = useAppDispatch();

  // states
  const [status, setStatus] = useState<
    false | 'requesting' | 'success' | 'failure'
  >(false);
  const [message, setMessage] = useState('');

  const [ uploadAvatar ] = useUpdateTeamAvatarMutation();
  const { selectedTeam, refetch: refetchTeam } = useSelectedTeam();
  const teamAvatar = useImageFromURL(
    selectedTeam?.teamId,
    selectedTeam?.links.getAvatar || '',
    {
      onError: refetchTeam,
    },
  );

  // refs
  const refContainer = useRef<HTMLInputElement | null>(null);

  const onFileSelected = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedTeam) return;

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (file.size > avatarLimitSize * 1024 * 1024) {
        setStatus('failure');
        setMessage(
          sprintf(
            __(
              'Upload failed. The avatar image size cannot be larger than %d MB.',
            ),
            avatarLimitSize,
          ),
        );
        return;
      }

      const avatarUrl = URL.createObjectURL(file);
      const prevAvatarUrl = teamAvatar;

      setStatus('requesting');

      dispatch(setAvatar({ key: selectedTeam.teamId, value: avatarUrl }));
      const resp = await uploadAvatar({
        teamId: selectedTeam.teamId,
        file,
      });
      if ('error' in resp) {
        setStatus('failure');
        setMessage(JSON.stringify(resp.error));
        dispatch(setAvatar({ key: selectedTeam.teamId, value: prevAvatarUrl }));
        return;
      }
      setStatus('success');
    }
  }, [dispatch, selectedTeam, teamAvatar, uploadAvatar]);

  const onUploadClick = useCallback(() => {
    setMessage('');
    setStatus(false);
    if (refContainer.current) {
      refContainer.current.click();
    }
  }, []);

  const isUploadEnabled = !!selectedTeam?.links.putAvatar;
  const isOwner = selectedTeam?.role === Roles.Owner;

  const buttonDisabled = !(isUploadEnabled && isOwner);

  return (
    <>
      <Typography component="p" align="center">
        <img
          src={teamAvatar || defaultTeamIcon}
          style={{
            ...ProfileImageStyle,
            opacity: status === 'requesting' ? 0.6 : 1,
          }}
          alt=""
        />
        <br />
        <Button
          variant="contained"
          color="default"
          onClick={onUploadClick}
          disabled={buttonDisabled}
        >
          {status === 'requesting' && (
            <CircularProgress size={16} style={{ marginRight: 8 }} />
          )}
          {__('Upload new picture')}
        </Button>
        <input
          ref={refContainer}
          accept="image/*"
          style={{ display: 'none' }}
          id="avatar-file"
          type="file"
          onChange={onFileSelected}
        />
        {status === 'failure' && message && (
          <Alert type="danger">{message}</Alert>
        )}
      </Typography>
    </>
  );
};

export default Content;
