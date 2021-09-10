import React, { useState, useEffect, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@material-ui/core';
import Interweave from 'interweave';

// libs
import { __, sprintf } from '@wordpress/i18n';

// Redux
import { useUpdateTeamMemberMutation } from '../../../redux/apis/app-api';

// Constants
import { Roles } from '../../../constants';

type Props = {
  currentMember: Geolonia.Member;
  open: boolean;
  toggle: (open: boolean) => void;
  team: Geolonia.Team;
};

const ChangeRole: React.FC<Props> = (props) => {
  const { currentMember, open, toggle, team } = props;
  const teamId = team.teamId;
  const [ updateMember ] = useUpdateTeamMemberMutation();
  const [role, setRole] = useState<false | Geolonia.Role>(
    currentMember.role,
  );
  const [status, setStatus] = useState<
    false | 'requesting' | 'success' | 'failure'
  >(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setRole(currentMember.role);
  }, [currentMember]);

  const onSaveClick = useCallback(async () => {
    if (role) {
      setStatus('requesting');
      const res = await updateMember({
        teamId,
        memberSub: currentMember.userSub,
        role,
      });

      if ('error' in res) {
        setStatus('failure');
        setMessage('failure');
        return;
      }

      setStatus('success');
      toggle(false);
    }
  }, [currentMember.userSub, role, teamId, toggle, updateMember]);

  const isRoleChanged = role === currentMember.role;
  const isBillingMember =
    currentMember.role === Roles.Owner &&
    currentMember.email === props.team.billingEmail;

  return (
    <div>
      <form>
        <Dialog
          open={open}
          onClose={() => toggle(false)}
          fullWidth={true}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">{__('Change role')}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {isBillingMember ? (
                <Interweave
                  content={sprintf(
                    __(
                      'The billing member %s cannot be degraded. Please modify the billing email at first on <a href="#/team/general">general team setting</a>.',
                    ),
                    currentMember.username,
                  )}
                ></Interweave>
              ) : (
                sprintf(__('Select a new role of %s.'), currentMember.username)
              )}
            </DialogContentText>

            <RadioGroup
              aria-label="role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value as Geolonia.Role)}
            >
              <FormControlLabel
                value="Owner"
                control={<Radio disabled={isBillingMember} />}
                label={__('Owner')}
              />
              <DialogContentText component="div">
                <ul>
                  <li>{__('can view API key usage.')}</li>
                  <li>{__('can manage payment settings.')}</li>
                  <li>{__('can invite another team member.')}</li>
                  <li>{__('can designate another owner.')}</li>
                  <li>{__('can suspend another member.')}</li>
                  <li>
                    {__(
                      'Can manage all resources in the team, including API Keys.',
                    )}
                  </li>
                </ul>
              </DialogContentText>

              <FormControlLabel
                value="Member"
                control={<Radio disabled={isBillingMember} />}
                label={__('Member')}
              />
              <DialogContentText component="div">
                <ul>
                  <li>{__('can view API key usage.')}</li>
                  <li>
                    {__(
                      'Can manage all resources in the team, including API Keys.',
                    )}
                  </li>
                </ul>
              </DialogContentText>
            </RadioGroup>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => toggle(false)} color="primary">
              {__('Cancel')}
            </Button>
            <Button
              color="primary"
              type="submit"
              onClick={onSaveClick}
              disabled={isRoleChanged || isBillingMember}
            >
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

export default ChangeRole;
