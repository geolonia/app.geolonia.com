import React, { useState, useCallback, useMemo } from 'react';

import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Title from '../custom/Title';

import PaymentMethodModal from './Billing/payment-method-modal';
import PlanModal from './Billing/plan-modal';
import PaymentHistory from './Billing/payment-history';
import classNames from 'classnames';

import './Billing.scss';

import { __, sprintf } from '@wordpress/i18n';

import { Roles } from '../../constants';

import {
  Box,
  CircularProgress, TableHead,
} from '@material-ui/core';

// stripe integration
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import moment from 'moment';

import { Redirect } from 'react-router';
import { useSelectedTeam, useUserLanguage, useGeoloniaPlans } from '../../redux/hooks';
import { useGetTeamPlanQuery, useUpdateTeamPlanMutation } from '../../redux/apis/app-api';
import Alert from '@material-ui/lab/Alert';

const UsageChart = React.lazy(() => import('./Billing/usage-chart'));

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY as string,
);

// connect with Stripe
const StripeContainer: React.FC = (props) => {
  return <Elements stripe={stripePromise}>
    {props.children}
  </Elements>;
};

type BillingInnerProps = {
  planDetails: Geolonia.TeamPlanDetails;
  team: Geolonia.Team;
  isRestricted: boolean | null;
  hasCustomMaxMapLoad: boolean;
};

const BillingInner: React.FC<BillingInnerProps> = (props) => {
  const language = useUserLanguage();
  const {team, planDetails, isRestricted, hasCustomMaxMapLoad} = props;
  const {
    planId,
    subscription,
    customer,
    usage,
    upcoming,
  } = planDetails;
  const currency = customer?.currency;
  const last2 = team.last2;
  const teamId = team.teamId;

  const [ updateTeam, { isLoading: teamIsUpdating } ] = useUpdateTeamPlanMutation();

  const [openPayment, setOpenPayment] = useState(false);
  const [openPlan, setOpenPlan] = useState(false);

  const plans = useGeoloniaPlans();
  const currencyFormatter = useMemo(() => {
    return new Intl.NumberFormat(language, {
      style: 'currency',
      currency: (currency || 'jpy'),
    });
  }, [currency, language]);

  const resumeSubscriptionHandler = useCallback(async () => {
    if (!planId) return;
    await updateTeam({ teamId, planId });
  }, [planId, teamId, updateTeam]);

  const isOwner = team.role === Roles.Owner || team.role ===  Roles.Operator;
  const currentPlan = plans.find((p) => p.planId === planId);
  const { selectedTeam } = useSelectedTeam();

  const subOrFreePlan = planDetails.subscription || planDetails.freePlanDetails;

  const maxLoadCount = team.customMaxMapLoadCount || team.baseFreeMapLoadCount;

  const openInvoicesWithAttempts = (planDetails.openInvoices || []).filter((inv) => inv.attempt_count > 0);

  return <>
    { openInvoicesWithAttempts.length > 0 && <>
      <Box sx={{ mb: 2 }}>
        <Alert
          severity="error"
        >
          {__('We were not able to charge your credit card. Please double check your payment details below. If this message doesn\'t clear within a few days, please contact us.')}
        </Alert>
      </Box>
    </>}

    { isOwner && <>
      <Grid container spacing={3} className="usage-info">
        <Grid item xs={12}>
          <Typography className="usage-info-title" component="h2">
            {__('Usage this month')}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Paper className="usage-card">
            <Typography component="h3">
              {__('Billing period')}
            </Typography>
            <div className="usage-card-content">
              {subOrFreePlan ?
                <>
                  {`${moment(subOrFreePlan.current_period_start).format('M/D')} ~ ${moment(subOrFreePlan.current_period_end).format('M/D')}`}
                </>
                :
                '-'
              }
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Paper className="usage-card">
            <Typography component="h3">
              {__('Next Payment Date')}
            </Typography>
            <div className="usage-card-content">
              {subscription ?
                <>
                  {moment(subscription.current_period_end).format('M/D')}
                </>
                :
                '-'
              }
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Paper className="usage-card">
            <Typography component="h3">
              {__('Map loads')}
            </Typography>
            <div className={classNames('usage-card-content', isRestricted ? ' is-restricted' : '')}>
              {!usage || typeof usage.count !== 'number' ? '-' : usage.count.toLocaleString()}
              {/* NOTE: 無制限の地図ロードは、十分に大きい maxLoadCount を指定することで現在実装している。 */}
              <small>{sprintf(__(' / %s loads'), maxLoadCount >= 999_999_999 ? '∞' : maxLoadCount.toLocaleString())}</small>
            </div>
            {/* NOTE: 未更新時（usage.updated = 1970-01-01T00:00:00Z が API から返ってくる） は、非表示にする */ }
            {(usage?.updated && usage.updated >= '2000-01-01T00:00:00Z') && <>
              <div className="updated-at">{sprintf(__('Last updated %s'), moment(usage.updated).format('YYYY/MM/DD HH:mm:ss'))}</div>
            </>}
            {isRestricted && <p className="restricted-mode-description">
              {__('Map loads have reached the limit.')}
              {hasCustomMaxMapLoad || __(' Please upgrade your plan to unlock it.')}
            </p>}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Paper className="usage-card">
            <Typography component="h3">
              {__('Charges')}
            </Typography>
            <div className="usage-card-content">
              {!upcoming || typeof upcoming.amount_due !== 'number' ? '-' : currencyFormatter.format(upcoming.amount_due)}
            </div>
          </Paper>
        </Grid>
      </Grid>
    </> }

    <UsageChart
      team={team}
      planDetails={planDetails}
    />

    {
      selectedTeam?.billingMode === 'STRIPE' && <Paper className="payment-info">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell component="th" scope="body" colSpan={3}>
                <Typography component="h2" className="module-title">
                  {__('Payment information')}
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isOwner && (
              <>
                { customer && customer.balance < 0 && <TableRow>
                  <TableCell component="th" scope="row">
                    {__('Current account credit:')}
                  </TableCell>
                  <TableCell colSpan={2}>
                    {currencyFormatter.format(Math.abs(customer.balance))}
                    {__(' : While this account has credits available, payments will deduct from account credit instead of the registered credit card.')}
                  </TableCell>
                </TableRow> }
                <TableRow>
                  <TableCell component="th" scope="row">
                    {__('Payment method:')}
                  </TableCell>
                  <TableCell>
                    {last2
                      ? sprintf(__('ending in **%1$s'), last2)
                      : ''}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setOpenPayment(true)}
                      type={'button'}
                    >
                      {__('Change payment method')}
                    </Button>
                    <PaymentMethodModal
                      teamId={teamId}
                      open={openPayment}
                      handleClose={() => setOpenPayment(false)}
                    />
                  </TableCell>
                </TableRow>
              </>
            )}
            <TableRow>
              <TableCell component="th" scope="row">
                {__('Current Plan')}
              </TableCell>
              <TableCell>
                { currentPlan?.name || '-' }
                { subscription && <>
                  <br />
                  { subscription.cancel_at_period_end && sprintf(__('Scheduled to expire on %1$s'), moment(subscription.current_period_end).format('YYYY-MM-DD'))}
                </>}
              </TableCell>
              { isOwner && <TableCell align="right">
                { subscription && subscription.cancel_at_period_end === true ?
                  <>
                    { teamIsUpdating ?
                      <CircularProgress
                        size={16}
                        color={'inherit'}
                      />
                      :
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={resumeSubscriptionHandler}
                        type={'button'}
                        disabled={!last2}
                      >
                        {__('Resume subscription')}
                      </Button>
                    }
                  </>
                  :
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenPlan(true)}
                    type={'button'}
                    disabled={!last2}
                  >
                    {__('Change Plan')}
                  </Button>
                }
                <PlanModal
                  open={openPlan}
                  handleClose={() => setOpenPlan(false)}
                  plans={plans}
                  currentPlanId={planId}
                  teamId={teamId}
                />
              </TableCell> }
            </TableRow>
          </TableBody>
        </Table>
        { isOwner && <p style={{ textAlign: 'right' }}>
          <a href="https://geolonia.com/pricing" target="_blank" rel="noreferrer">
            {__('Learn more about plans on the pricing page.')}
          </a>
        </p> }
      </Paper>
    }
  </>;
};

const Billing: React.FC = () => {
  const { selectedTeam, isRestricted } = useSelectedTeam();
  const isOwner = selectedTeam?.role === Roles.Owner;
  const teamName = selectedTeam?.name;
  const teamId = selectedTeam?.teamId;
  const hasCustomMaxMapLoad = !!selectedTeam?.customMaxMapLoadCount;

  const { data: planDetails, isFetching: planDetailsLoading } = useGetTeamPlanQuery({ teamId: teamId || '' }, {
    skip: !selectedTeam,
  });

  const breadcrumbItems = [
    {
      title: __('Home'),
      href: '#/',
    },
    {
      title: __('Team settings'),
      href: '#/team/general',
    },
  ];

  if (!selectedTeam || !teamId) return null;

  if (selectedTeam && selectedTeam.billingMode !== 'STRIPE' && selectedTeam.billingMode !== 'INVOICE') {
    return <Redirect to="/" />;
  }

  return (
    <StripeContainer>
      <div className="billing">
        <Title title={__('Billing and Plans')} breadcrumb={breadcrumbItems}>
          {sprintf(__('You can check and change your current pricing plan and usage status of Team %s.'), teamName)}
        </Title>

        { (!planDetailsLoading && typeof planDetails !== 'undefined' && selectedTeam) ? (
          <BillingInner
            team={selectedTeam}
            isRestricted={isRestricted}
            hasCustomMaxMapLoad={hasCustomMaxMapLoad}
            planDetails={planDetails}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '200px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CircularProgress />
          </div>
        ) }

        { isOwner && selectedTeam?.billingMode === 'STRIPE' && <Paper>
          <Typography component="h2" className="module-title">
            {__('Payment history')}
          </Typography>
          <PaymentHistory
            teamId={teamId}
          />
        </Paper> }
      </div>
    </StripeContainer>
  );
};

export default Billing;
