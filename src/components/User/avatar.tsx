import React, { useState, useRef, useCallback } from 'react';

// components
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import PersonIcon from '@material-ui/icons/Person';
import Avatar from '@material-ui/core/Avatar';
import { CircularProgress } from '@material-ui/core';
import Alert from '../custom/Alert';

// utils
import { __, sprintf } from '@wordpress/i18n';

// constants
import { avatarLimitSize } from '../../constants';

// redux
import { useImageFromURL, useAppDispatch } from '../../redux/hooks';
import { useSession } from '../../hooks/session';
import { useGetUserQuery, useUpdateUserAvatarMutation } from '../../redux/apis/app-api';
import { setAvatar } from '../../redux/actions/avatar';

const ProfileImageStyle: React.CSSProperties = {
  width: '250px',
  height: '250px',
  fill: '#dedede',
  margin: 'auto',
};

export const AvatarSection: React.FC<{}> = () => {
  const dispatch = useAppDispatch();

  // states
  const [status, setStatus] = useState<false | 'requesting' | 'success' | 'failure'>(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [ uploadAvatar ] = useUpdateUserAvatarMutation();
  const { userSub } = useSession();
  const { data: user, refetch: refetchUser } = useGetUserQuery({ userSub }, { skip: !userSub });

  const userAvatar = useImageFromURL(
    userSub,
    user?.links.getAvatar || '',
    {
      onError: refetchUser,
    },
  );

  // refs
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!userSub) return;

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (file.size > avatarLimitSize * 1024 * 1024) {
        setStatus('failure');
        setErrorMessage(sprintf(
          __(
            'Upload failed. The avatar image size cannot be larger than %d MB.',
          ),
          avatarLimitSize,
        ));
        return;
      }

      const avatarUrl = URL.createObjectURL(file);
      const prevAvatarUrl = userAvatar;

      setStatus('requesting');

      dispatch(setAvatar({ key: userSub, value: avatarUrl }));
      const result = await uploadAvatar({ file, userSub });
      if ('error' in result) {
        dispatch(setAvatar({ key: userSub, value: prevAvatarUrl })); // roleback
        setStatus('failure');
        setErrorMessage(__('Upload failed.'));
      } else {
        dispatch(setAvatar({ key: userSub, value: avatarUrl }));
        setStatus('success');
      }
    }
  }, [dispatch, userSub, userAvatar, uploadAvatar]);

  const handleUploadClick = useCallback(() => {
    setStatus(false);
    setErrorMessage('');
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  }, []);

  return <Typography component="div" align="center">
    {userAvatar ? (
      <Avatar
        src={userAvatar}
        style={{
          ...ProfileImageStyle,
          opacity: status === 'requesting' ? 0.6 : 1,
        }}
      ></Avatar>
    ) : (
      <PersonIcon style={ProfileImageStyle} />
    )}
    <br />
    <Button
      variant="contained"
      color="default"
      onClick={handleUploadClick}
    >
      {status === 'requesting' && (
        <CircularProgress size={16} style={{ marginRight: 8 }} />
      )}
      {__('Upload new picture')}
    </Button>
    <input
      ref={(ref) => (inputFileRef.current = ref)}
      accept="image/*"
      style={{ display: 'none' }}
      id="avatar-file"
      type="file"
      onChange={handleFileSelect}
    />
    <br />
    {status === 'failure' && errorMessage && (
      <Alert type="danger">{errorMessage}</Alert>
    )}
  </Typography>;
};

export default AvatarSection
;
