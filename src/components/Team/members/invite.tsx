import React, { useState } from 'react';

// Components
import AddNew from '../../custom/AddNew';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

// Util
import { sprintf, __ } from '@wordpress/i18n';
import fetch from '../../../lib/fetch';

// redux
import { connect } from 'react-redux';
import { buildApiAppUrl } from '../../../lib/api';
import Interweave from 'interweave';

type OwnProps = {
  disabled?: boolean;
};

type StateProps = {
  session: Geolonia.Session;
  members: Geolonia.Member[];
  team: Geolonia.Team | void;
};
type Props = OwnProps & StateProps;

export const Invite = (props: Props) => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<
    false | 'requesting' | 'success' | 'failure'
  >(false);

  const inviteHandler = async (email: string) => {
    const { session, team, members } = props;

    if (members.find((member) => member.email === email)) {
      setMessage(__('That user is already a member of this team.'));
      return Promise.reject('That user is already a member of the team.');
    }

    if (team) {
      setStatus('requesting');
      const res = await fetch(
        session,
        buildApiAppUrl(`/teams/${team.teamId}/invitation`),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        },
      );
      if (res.status < 400) {
        setStatus('success');
        return res.json();
      } else if (res.status === 402) {
        setStatus('failure');
        setMessage(__('The maximum number of members has been reached.'));
        throw new Error();
      } else {
        setStatus('failure');
        setMessage(__('You cannot use this email address for invitation.'));
        throw new Error();
      }
    } else {
      return Promise.reject('No team');
    }
  };

  const teamName = props.team && props.team.name;

  return (
    <>
      <AddNew
        disabled={props.disabled}
        buttonLabel={__('Invite')}
        label={__('Send an invitation')}
        description={<Interweave content={
          sprintf(__('Please enter the email address of the person you want to invite to "%s".'), teamName)
        } />}
        defaultValue=""
        fieldName="email"
        fieldLabel={__('Receipient\'s email address')}
        fieldType="email"
        errorMessage={message}
        onClick={inviteHandler}
        onError={() => {}}
        onSuccess={() => {}}
        saveButtonLabel={__('Send')}
      />
      <Snackbar
        className={`snackbar-saved ${status}`}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={status === 'success' || status === 'failure'}
        autoHideDuration={6000}
        onClose={() => setStatus(false)}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={
          <span id="message-id">
            {status === 'success'
              ? __('Successfully send invitation.')
              : status === 'failure'
                ? __('Failed to send invitation.')
                : ''}
          </span>
        }
        action={[
          <IconButton
            key="close"
            aria-label="close"
            color="inherit"
            onClick={() => setStatus(false)}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />
    </>
  );
};

export const mapStateToProps = (state: Geolonia.Redux.AppState): StateProps => {
  const { session } = state.authSupport;
  const selectedTeamIndex = state.team.selectedIndex;
  const team = state.team.data[selectedTeamIndex] as Geolonia.Team | void;
  let members: Geolonia.Member[] = [];
  if (team) {
    const memberObject = state.teamMember[team.teamId];
    if (memberObject) {
      members = memberObject.data;
    }
  }
  return { session, team, members };
};

export default connect(mapStateToProps)(Invite);
