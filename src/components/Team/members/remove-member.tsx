import React, { useState } from 'react';
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

// API
import deleteMember from '../../../api/members/delete';

// Redux
import { connect } from 'react-redux';
import { createActions as createTeamMemberActions } from '../../../redux/actions/team-member';
import Redux from 'redux';

type OwnProps = {
  currentMember: Geolonia.Member;
  open: boolean;
  toggle: (open: boolean) => void;
};
type StateProps = {
  session: Geolonia.Session;
  teamId: string;
  teamName: string;
};
type DispatchProps = {
  deleteMemberState: (teamId: string, memberSub: string) => void;
};
type Props = OwnProps & StateProps & DispatchProps;

const RemoveMember = (props: Props) => {
  const { currentMember, teamName, open, toggle, deleteMemberState } = props;
  const [status, setStatus] = useState<
    false | 'requesting' | 'success' | 'failure'
  >(false);
  const [message, setMessage] = useState('');

  const onRemoveClick = () => {
    setStatus('requesting');
    deleteMember(props.session, props.teamId, currentMember.userSub).then(
      (result) => {
        if (result.error) {
          setStatus('failure');
          setMessage(result.message);
        } else {
          setStatus('success');
          deleteMemberState(props.teamId, currentMember.userSub);
          toggle(false);
        }
      },
    );
  };

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
            {sprintf('Removing 1 member from %s.', teamName)}
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
              {__('Remove')}
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
};

const mapStateToProps = (state: Geolonia.Redux.AppState): StateProps => {
  const team = state.team.data[state.team.selectedIndex];
  return {
    session: state.authSupport.session,
    teamId: team.teamId,
    teamName: team.name,
  };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch): DispatchProps => ({
  deleteMemberState: (teamId, userSub) =>
    dispatch(createTeamMemberActions.delete(teamId, userSub)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RemoveMember);
