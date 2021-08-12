import React, { useState, useCallback } from 'react';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { __ } from '@wordpress/i18n';
import fetch from '../../../lib/fetch';
import { connect } from 'react-redux';
import { GeoloniaConstantPlan, parsePlanLabel } from '../Billing';
import {
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@material-ui/core';
import { buildApiAppUrl } from '../../../lib/api';
import Alert from '../../custom/Alert';

type PlanId = string | null | undefined;

type OwnProps = {
  open: boolean;
  handleClose: () => void;
  plans: GeoloniaConstantPlan[];
  currentPlanId: PlanId;
};
type StateProps = {
  session: Geolonia.Session;
  teamId?: string;
};
type Props = OwnProps & StateProps;

const modalStyle: React.CSSProperties = {
  position: 'absolute',
  minWidth: 600,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  background: 'white',
  padding: '2em 4em 3em',
};

const useMessage = (
  currentPlanId: PlanId,
  nextPlanId: PlanId,
): string | undefined => {
  if (
    currentPlanId === undefined ||
    nextPlanId === undefined ||
    currentPlanId === nextPlanId ||
    currentPlanId === null
  ) {
    return undefined;
  } else if (nextPlanId === null) {
    return __('Your subscription will be canceled.');
  } else if (nextPlanId !== null) {
    return __(
      'The difference between the plan changes will be charged or charged as a balance.',
    );
  } else {
    return undefined;
  }
};

const PlanModal = (props: Props) => {
  const { open, handleClose, session, teamId, plans, currentPlanId } = props;
  const [loading, setLoading] = useState(false);
  const [planId, setPlanId] = useState<PlanId>(void 0);
  const message = useMessage(currentPlanId, planId);
  const [ alertMessage, setAlertMessage ] = useState<string | undefined>();

  const handleSubmit = useCallback(async () => {
    if (!teamId) {
      return null;
    }
    setLoading(true);
    const res = await fetch(
      session,
      buildApiAppUrl(`/teams/${teamId}/plan`),
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      },
    );

    try {
      const resp = await res.json();
      if (res.status < 400) {
        handleClose();
        window.location.reload();
      } else if (res.status === 402 && resp.message === 'Payment required for this action.') {
        // something happened with changing the plan
        setAlertMessage(__('The plan could not be changed. If you are trying to downgrade your team to a team that supports fewer members, please remove the extra members before downgrading your team. If you still get this error, please contact us.'));
      } else {
        throw new Error();
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [ session, teamId, planId, setLoading, handleClose ]);

  const currencyFormatter = new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  });

  return (
    <Modal open={open} onClose={handleClose}>
      <div style={modalStyle}>
        <Typography component="h2">{__('Your plan')}</Typography>
        <div style={{ marginTop: '1em' }}>
          {plans.map((plan) => (
            <RadioGroup key={plan.planId} name="plan">
              <FormControlLabel
                value={plan.planId || 'null'}
                control={
                  <Radio
                    checked={
                      plan.planId ===
                      (planId === void 0 ? currentPlanId : planId)
                    }
                    onChange={(e) => setPlanId(plan.planId)}
                  />
                }
                label={<>
                  {parsePlanLabel(plans, plan.planId)}
                  {typeof plan.price !== 'undefined' && <>
                    &nbsp;-&nbsp;
                    {currencyFormatter.format(plan.price)}/月
                  </> }
                </>}
              />
              {/* <DialogContentText>
                <ul>
                  <li>{__("can invite another team member.")}</li>
                  <li>{__("can designate another owner.")}</li>
                  <li>{__("can suspend another member.")}</li>
                  <li>
                    {__(
                      "Can manage all resources in the team, including API Keys."
                    )}
                  </li>
                </ul>
              </DialogContentText> */}
            </RadioGroup>
          ))}
          <Typography component="p" style={{ marginTop: '0.5em', marginBottom: '1em' }}>
            {__('All prices include a 10% Japanese Consumption Tax')}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            type={'button'}
            disabled={planId === void 0 || currentPlanId === planId}
          >
            {loading && (
              <CircularProgress
                size={16}
                style={{ marginRight: 8 }}
                color={'inherit'}
              />
            )}
            {__('Update')}
          </Button>
          <p>{message}</p>
          { typeof alertMessage !== 'undefined' && <Alert>
            {alertMessage}
          </Alert>}
        </div>
      </div>
    </Modal>
  );
};

export const mapStateToProps = (state: Geolonia.Redux.AppState): StateProps => {
  const team = state.team.data[state.team.selectedIndex];
  const { session } = state.authSupport;
  if (team) {
    const { teamId } = team;
    return {
      session,
      teamId,
    };
  } else {
    return { session };
  }
};

export default connect(mapStateToProps)(PlanModal);
