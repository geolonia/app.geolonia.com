import React, { useState, useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';

// Utils
import { __ } from '@wordpress/i18n';
import { connect } from 'react-redux';
import { SELECTED_TEAM_ID_KEY } from '../redux/middlewares/local-storage';
import { acceptInvitation } from '../api/teams/accept-invitation';

type OwnProps = { isReady: boolean };
type RouterProps = {
  match: { params: { invitationToken: string; teamId: string } };
};
type Props = OwnProps & RouterProps;

const useInvitationAcceptRequest = (props: Props) => {
  const [status, setStatus] = useState<
    false | 'success' | 'failure' | 'requesting'
  >(false);

  const {
    isReady,
    match: {
      params: { invitationToken, teamId },
    },
  } = props;

  useEffect(() => {
    if (isReady && status === false) {
      setStatus('requesting');
      acceptInvitation(invitationToken)
        .then((res) => {
          if (res.status < 400) {
            localStorage.setItem(SELECTED_TEAM_ID_KEY, teamId);
            setStatus('success');
          } else {
            throw res.json();
          }
        })
        .catch((error) => {
          setStatus('failure');
        });
    }
  }, [invitationToken, isReady, status, teamId]);

  return { status, proceed: () => (window.location.href = '/') };
};

const AcceptInvitation = (props: Props) => {
  const { status, proceed } = useInvitationAcceptRequest(props);

  const open = status === 'success' || status === 'failure';

  let message = '';
  switch (status) {
  case 'success':
    message = __('Your invitation has been validated.');
    break;
  case 'failure':
    message = __('Your invitation has been outdated.');
    break;
  }

  return (
    <Snackbar
      style={{ top: 50, backgroundColor: 'primary' }}
      message={message}
      open={open}
      action={
        <Button color={'primary'} size="small" onClick={proceed}>
          {'continue'}
        </Button>
      }
    ></Snackbar>
  );
};

const mapStateToProps = (appState: Geolonia.Redux.AppState): OwnProps => {
  return {
    isReady: appState.authSupport.isReady,
  };
};

export default connect(mapStateToProps)(AcceptInvitation);
