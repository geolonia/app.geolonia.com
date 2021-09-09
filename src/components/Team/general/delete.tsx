import React, { useCallback, useState } from 'react';

// Components
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import {
  CircularProgress,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';

// utils
import { __, sprintf } from '@wordpress/i18n';
import Interweave from 'interweave';

// api
import { useSelectedTeam } from '../../../redux/hooks';
import {
  useGetTeamsQuery,
  useDeleteTeamMutation,
} from '../../../redux/apis/app-api';
import { useHistory } from 'react-router-dom';

// parameters
const styleDangerZone: React.CSSProperties = {
  border: '1px solid #ff0000',
  padding: '16px 24px',
};

const TeamDeletion: React.FC = () => {
  const history = useHistory();

  // state
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const [status, setStatus] = useState<
    false | 'requesting' | 'success' | 'failure'
  >(false);

  const team = useSelectedTeam();
  const { data: teams } = useGetTeamsQuery();
  const [ deleteTeam ] = useDeleteTeamMutation();
  const teamLength = (teams && teams.length) || 0;

  const saveHandler = useCallback(async () => {
    if (!team) return;
    if (confirmation.toUpperCase() !== 'DELETE') {
      return;
    }

    setStatus('requesting');
    await deleteTeam(team.teamId);

    setConfirmation('');
    setStatus('success');
    history.push('/');
  }, [confirmation, deleteTeam, history, team]);

  if (!team) return null;

  return (
    <div style={styleDangerZone}>
      <Typography component="h3" color="secondary">
        {__('Danger Zone')}
      </Typography>
      <p>
        {
          teamLength < 2 ?
            __(
              'You must have at least one team to use Geolonia Maps. If you have only one team, please create a new one, and then delete the team.',
            ) :
            __(
              'Once you delete a team, there is no going back. Please be certain. ',
            )
        }
      </p>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setOpen(true)}
        disabled={teamLength < 2}
      >
        {__('Delete')}
      </Button>

      <form>
        <Dialog
          open={open}
          // onClose={handleClose}
          fullWidth={true}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            <Typography component="span" color="secondary">
              {__('Confirm deletion')}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Interweave
                content={sprintf(
                  __(
                    'Please enter <code>delete</code> if you really want to delete the team <strong>%1$s</strong>.',
                  ),
                  team.name,
                )}
              />
            </DialogContentText>
            <TextField
              autoFocus
              error
              margin="normal"
              name="team-deletion-confirm"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              disabled={status !== false}
              fullWidth
              placeholder="delete"
            />
            {status === 'failure' && <DialogContentText>{}</DialogContentText>}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setConfirmation('');
                setOpen(false);
              }}
              color="default"
              disabled={status !== false}
            >
              {__('Cancel')}
            </Button>
            <Button
              onClick={saveHandler}
              color="secondary"
              type="submit"
              disabled={
                confirmation.toUpperCase() !== 'DELETE' || status !== false
              }
            >
              {status === 'requesting' ? (
                <CircularProgress
                  size={16}
                  style={{ marginRight: 8 }}
                  color={'secondary'}
                />
              ) : status === 'success' ? (
                <CheckIcon fontSize={'medium'} color={'secondary'} />
              ) : null}
              {__('Delete')}
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
};

export default TeamDeletion;
