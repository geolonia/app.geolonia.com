import React, { useState, useRef } from 'react';

// Components
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import defaultTeamIcon from '../../custom/team.svg';
import { CircularProgress } from '@material-ui/core';
import Alert from '../../custom/Alert';

// utils
import { __, sprintf } from '@wordpress/i18n';

// API
import putAvatar from '../../../api/teams/put-avatar';

// constants
import { avatarLimitSize, Roles } from '../../../constants';
import { useAppSelector, useSelectedTeam } from '../../../redux/hooks';

// type OwnProps = Record<string, never>;
// type StateProps = {
//   session: Geolonia.Session;
//   team: Geolonia.Team;
//   index: number;
// };
// type DispatchProps = {
//   setAvatar: (index: number, blobUrl: string | void) => void;
// };
// type Props = OwnProps & StateProps & DispatchProps;

const ProfileImageStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '250px',
  height: 'auto',
  margin: '16px',
};

const Content: React.FC = () => {
  const session = useAppSelector((state) => state.authSupport.session);
  // states
  const [status, setStatus] = useState<
    false | 'requesting' | 'success' | 'failure'
  >(false);
  const [message, setMessage] = useState('');

  const team = useSelectedTeam();

  // refs
  const refContainer = useRef<HTMLInputElement | null>(null);

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!team) return;

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
      const prevAvatarUrl = team.avatarImage;
      setStatus('requesting');

      putAvatar(session, team.teamId, file).then((result) => {
        if (result.error) {
          // props.setAvatar(props.index, prevAvatarUrl); // roleback
          setStatus('failure');
          setMessage(result.message);
        } else {
          // props.setAvatar(props.index, avatarUrl);
          setStatus('success');
        }
      });
    }
  };

  const onUploadClick = () => {
    setMessage('');
    setStatus(false);
    if (refContainer.current) {
      refContainer.current.click();
    }
  };

  const isUploadEnabled = !!team?.links.putAvatar;
  const isOwner = team?.role === Roles.Owner;

  const buttonDisabled = !(isUploadEnabled && isOwner);

  return (
    <>
      <Typography component="p" align="center">
        <img
          src={team?.avatarImage || defaultTeamIcon}
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

// const mapStateToProps = (state: Geolonia.Redux.AppState): StateProps => ({
//   session: state.authSupport.session,
//   team: state.team.data[state.team.selectedIndex],
//   index: state.team.selectedIndex,
// });

// const mapDispatchToProps = (dispatch: Redux.Dispatch): DispatchProps => ({
//   setAvatar: (index, blobUrl) =>
//     dispatch(createTeamActions.setAvatar(index, blobUrl)),
// });

// export default connect(mapStateToProps, mapDispatchToProps)(Content);

export default Content;
