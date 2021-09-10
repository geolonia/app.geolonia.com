import React, { useCallback, useState } from 'react';

// Components
import AddNew from '../../custom/AddNew';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

// Util
import { sprintf, __ } from '@wordpress/i18n';
import Interweave from 'interweave';

// redux
import { useSelectedTeam } from '../../../redux/hooks';
import { useCreateTeamMemberInvitationMutation } from '../../../redux/apis/app-api';

type Props = {
  disabled?: boolean;
  team: Geolonia.Team;
  members: Geolonia.Member[];
};

export const Invite: React.FC<Props> = (props) => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<
    false | 'requesting' | 'success' | 'failure'
  >(false);

  const { disabled, members, team } = props;

  const [ createInvitation ] = useCreateTeamMemberInvitationMutation();

  const inviteHandler = useCallback(async (email: string) => {
    if (members.find((member) => member.email === email)) {
      setStatus('failure');
      setMessage(__('That user is already a member of this team.'));
      throw new Error('That user is already a member of the team.');
    }

    setStatus('requesting');
    const res = await createInvitation({
      teamId: team.teamId,
      email,
    });
    if ('error' in res) {
      setStatus('failure');
      setMessage(__('The maximum number of members has been reached.'));
      // setMessage(__('You cannot use this email address for invitation.'));
      throw new Error();
    }
    setStatus('success');
  }, [createInvitation, members, team]);

  const teamName = team.name;

  return (
    <>
      <AddNew
        disabled={disabled}
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

export default Invite;
