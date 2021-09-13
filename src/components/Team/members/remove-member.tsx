import React, { useCallback, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Box, CircularProgress } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';

// libs
import { __, sprintf } from '@wordpress/i18n';
import { sleep } from '../../../lib/sleep';
import { pageTransitionInterval } from '../../../constants';

// Redux
import { useDeleteTeamMemberMutation } from '../../../redux/apis/app-api';

type Props = {
  team: Geolonia.Team;
  currentMember: Geolonia.Member;
  open: boolean;
  toggle: (open: boolean) => void;
  mode: 'remove' | 'leave';
};

const RemoveMember: React.FC<Props> = (props) => {
  const { currentMember, team, open, toggle, mode } = props;
  const { teamId, name: teamName } = team;
  const [ deleteMember ] = useDeleteTeamMemberMutation();
  const [status, setStatus] = useState<
    false | 'requesting' | 'success' | 'failure'
  >(false);
  const [message, setMessage] = useState('');

  const onRemoveClick = useCallback(async () => {
    setStatus('requesting');
    const res = await deleteMember({
      teamId,
      memberSub: currentMember.userSub,
    });
    if ('error' in res) {
      setStatus('failure');
      setMessage(__('An unexpected error occurred. Please try again.'));
      return;
    }
    setStatus('success');
    toggle(false);
    if (mode === 'leave') {
      await sleep(pageTransitionInterval);
      window.location.reload();
    }
  }, [currentMember.userSub, deleteMember, mode, teamId, toggle]);

  return (
    <div>
      <form>
        <Dialog
          open={open}
          onClose={() => toggle(false)}
          fullWidth={true}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            { mode === 'remove' ?
              sprintf(__('Removing 1 member from %s.'), teamName) :
              sprintf(__('Leave from %s.'), teamName)
            }
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {__('The following members will be removed:')}
            </DialogContentText>

            <Box display="flex" alignItems="center">
              <PersonIcon />
              <p style={{ marginLeft: '1em' }}>
                {currentMember.name}
                <br />@{currentMember.username}
              </p>
            </Box>

            <DialogContentText>{message}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => toggle(false)} color="primary">
              {__('Cancel')}
            </Button>
            <Button color="primary" type="submit" onClick={onRemoveClick}>
              {status === 'requesting' && (
                <CircularProgress size={16} style={{ marginRight: 8 }} />
              )}
              {mode === 'remove' ? __('Remove') : __('Leave')}
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
};

export default RemoveMember;
