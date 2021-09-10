import React, { useState, useCallback } from 'react';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { __ } from '@wordpress/i18n';
import {
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@material-ui/core';
import Alert from '../../custom/Alert';
import { useUpdateTeamPlanMutation } from '../../../redux/apis/app-api';

type PlanId = string | null | undefined;

type Props = {
  open: boolean;
  handleClose: () => void;
  plans: Geolonia.Billing.Plan[];
  currentPlanId: PlanId;
  teamId: string;
};
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

const PlanModal: React.FC<Props> = (props) => {
  const { open, handleClose, teamId, plans, currentPlanId } = props;
  const [ updateTeam, { isLoading: teamIsUpdating } ] = useUpdateTeamPlanMutation();

  const [planId, setPlanId] = useState<PlanId>(void 0);
  const message = useMessage(currentPlanId, planId);
  const [ alertMessage, setAlertMessage ] = useState<string | undefined>();

  const handleSubmit = useCallback(async () => {
    if (typeof planId === 'undefined') return;

    const res = await updateTeam({ teamId, planId });
    if ('error' in res) {
      setAlertMessage(__('The plan could not be changed. If you are trying to downgrade your team to a team that supports fewer members, please remove the extra members before downgrading your team. If you still get this error, please contact us.'));
      return;
    }

    handleClose();
  }, [updateTeam, teamId, planId, handleClose]);

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
                  {plan.name}
                  {'price' in plan && <>
                    &nbsp;-&nbsp;
                    {currencyFormatter.format(plan.price)}/月
                  </> }
                </>}
              />
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
            {teamIsUpdating && (
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

export default PlanModal;
