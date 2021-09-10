import React, { useState, useEffect, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { CircularProgress, Box } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';

// libs
import { __ } from '@wordpress/i18n';

// constants
import { Roles } from '../../../constants';

// Redux
import { useUpdateTeamMemberMutation } from '../../../redux/apis/app-api';

type Props = {
  currentMember: Geolonia.Member;
  team: Geolonia.Team;
  open: boolean;
  toggle: (open: boolean) => void;
  mode: 'suspending' | 'unsuspending';
};

const Suspend: React.FC<Props> = (props) => {
  const { currentMember, team, open, toggle, mode } = props;
  const teamId = team.teamId;
  const [role, setRole] = useState<false | Geolonia.Role>(
    currentMember.role,
  );
  const [ updateMember ] = useUpdateTeamMemberMutation();
  const [status, setStatus] = useState<
    false | 'requesting' | 'success' | 'failure'
  >(false);
  const [message, setMessage] = useState('');

  const isSuspending = mode === 'suspending';

  useEffect(() => {
    setRole(currentMember.role);
  }, [currentMember]);

  const onSaveClick = useCallback(async () => {
    if (!role) return;

    setStatus('requesting');
    const res = await updateMember({
      teamId,
      memberSub: currentMember.userSub,
      role: isSuspending ? Roles.Suspended : Roles.Member,
    });
    if ('error' in res) {
      setStatus('failure');
      setMessage('failure');
      return;
    }

    setStatus('success');
    toggle(false);
  }, [currentMember.userSub, isSuspending, role, teamId, toggle, updateMember]);

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
            {isSuspending ? __('Suspend team members') : __('Unsuspend team members')}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {
                isSuspending ?
                  __('The following members will be suspended:') :
                  __('The following members will be unsuspended:')
              }
            </DialogContentText>

            <Box display="flex" alignItems="center">
              <PersonIcon />
              <p style={{ marginLeft: '1em' }}>
                {currentMember.name}
                <br />@{currentMember.username}
              </p>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => toggle(false)} color="primary">
              {__('Cancel')}
            </Button>
            <Button color="primary" type="submit" onClick={onSaveClick}>
              {status === 'requesting' && (
                <CircularProgress size={16} style={{ marginRight: 8 }} />
              )}
              {__('Save')}
            </Button>
          </DialogActions>

          {status === 'failure' && (
            <DialogContent>
              <DialogContentText color={'secondary'}>
                {message}
              </DialogContentText>
            </DialogContent>
          )}
        </Dialog>
      </form>
    </div>
  );
};

export default Suspend;
