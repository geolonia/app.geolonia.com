import React, { useState, useEffect, useCallback, useMemo } from 'react';

import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
// import { Line } from "react-chartjs-2";
// import Save from "../custom/Save";
import Title from '../custom/Title';
import PaymentMethodModal from './Billing/payment-method-modal';
import PlanModal from './Billing/plan-modal';
import Receipts from './Billing/Receipts';
import './Billing.scss';

import { __, sprintf, _n } from '@wordpress/i18n';
import { connect } from 'react-redux';

import {
  CircularProgress, TableHead,
} from '@material-ui/core';

// stripe integration
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import moment from 'moment';

import customFetch from '../../lib/fetch';
import { Redirect } from 'react-router';
import { buildApiAppUrl } from '../../lib/api';

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY as string,
);

// connect with Stripe
const StripeContainer = (props: { children: React.ReactNode }) => {
  return <Elements stripe={stripePromise}>{props.children}</Elements>;
};

type StateProps = {
  session: Geolonia.Session;
  last2?: string;
  isOwner?: boolean;
  memberCount?: number;
  team?: Geolonia.Team;
  language: string;
};

type Duration = '' | 'month' | 'year';

export type GeoloniaFreePlan = {
  planId: null;
  name: string;
  duration: Duration;
  contactRequired: undefined;
};

export type GeoloniaConstantPlan = {
  planId: string;
  name: string;
  price: number;
  duration: Duration;
  maxMemberLength: number;
  contactRequired: false;
};

type GeoloniaAppliancePlan = {
  name: string;
  contactRequired: boolean;
  unitPrice: number;
};

type GeoloniaPlan =
  | GeoloniaFreePlan
  | GeoloniaConstantPlan
  | GeoloniaAppliancePlan;

const isAppliancePlan = (plan: GeoloniaPlan): plan is GeoloniaAppliancePlan => {
  return plan.contactRequired === true;
};

type PossiblePlanId = string | null | undefined;

interface SubscriptionDetails {
  cancel_at_period_end: boolean;
  current_period_end: number;
}

interface CustomerDetails {
  balance: number
  currency: string
}

interface UsageDetails {
  count: number
  lastLoggedRequest: string
  updated: string
}

export const parsePlanLabel = (
  plans: GeoloniaPlan[],
  planId: PossiblePlanId,
) => {
  if (planId === null) {
    return __('Free plan');
  }
  const plan = plans.find((plan) => (plan as GeoloniaConstantPlan).planId === planId);
  return plan?.name;
};

const usePlan = (props: StateProps) => {
  const { session, team } = props;
  const teamId = team?.teamId;
  const [plans, setPlans] = useState<GeoloniaPlan[]>([]);
  // planId === null フリープラン
  // planId === void 0 リクエスト中
  const [planId, setPlanId] = useState<string | null | undefined>(void 0);
  const [subscription, setSubscription] = useState<SubscriptionDetails | undefined>(undefined);
  const [customer, setCustomer] = useState<CustomerDetails | undefined>(undefined);
  const [usage, setUsage] = useState<UsageDetails | undefined>(undefined);
  const [loaded, setLoaded] = useState(false);

  // 全てのプランを取得
  useEffect(() => {
    (async () => {
      const freePlan: GeoloniaFreePlan = {
        planId: null,
        name: __('Free Plan'),
        duration: 'month',
        contactRequired: void 0,
      };

      const res = await fetch(buildApiAppUrl('/plans'));
      const data = await res.json();
      setPlans([freePlan, ...data]);
    })();
  }, [ setPlans ]);

  // チーム変えたらロード状態をリセット
  useEffect(() => {
    setLoaded(false);
    setPlanId(undefined);
  }, [ teamId ]);

  useEffect(() => {
    // 現在のプランを取得する
    if (!(session && teamId && !loaded)) {
      return;
    }

    (async () => {
      const res = await customFetch(
        session,
        buildApiAppUrl(`/teams/${teamId}/plan`),
      );
      const data = await res.json();
      setPlanId(data.planId);
      setSubscription(data.subscription);
      setCustomer(data.customer);
      setUsage(data.usage);
      setLoaded(true);
    })();
  }, [ loaded, session, teamId ]);

  const currentPlanName = parsePlanLabel(plans, planId);

  return {
    loaded,
    plans,
    name: currentPlanName,
    planId,
    subscription,
    customer,
    usage,
  };
};

const Billing = (props: StateProps) => {
  const { session, team, language } = props;
  const teamName = team?.name;
  const teamId = team?.teamId;
  const [openPayment, setOpenPayment] = useState(false);
  const [openPlan, setOpenPlan] = useState(false);
  const { loaded, plans, name, planId, subscription, customer, usage } = usePlan(props);
  const [ resumeSubLoading, setResumeSubLoading ] = useState(false);

  const currency = customer?.currency;

  const currencyFormatter = useMemo(() => {
    return new Intl.NumberFormat(language, {
      style: 'currency',
      currency: (currency || 'jpy'),
    });
  }, [currency, language]);

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

  const resumeSubscriptionHandler = useCallback(async () => {
    if (resumeSubLoading) {
      return;
    }

    setResumeSubLoading(true);
    const res = await customFetch(
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
      if (res.status < 400) {
        window.location.reload();
      } else {
        throw new Error();
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setResumeSubLoading(false);
    }
  }, [ session, planId, teamId, resumeSubLoading, setResumeSubLoading ]);

  if (team && team.billingMode !== 'STRIPE') {
    return <Redirect to="/" />;
  }

  let inner: JSX.Element;
  if (!loaded) {
    inner = <div
      style={{
        width: '100%',
        height: '200px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CircularProgress />
    </div>;
  } else {

    inner = <>
      <Grid container spacing={3} className="usage-info">
        <Grid item xs={12} md={12}>
          <Typography component="h2">
            {__('Usage information for this month')}
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper className="usage-card">
            <Typography component="h3">
              {__('集計期間')}
            </Typography>
            <div className="usage-card-content">{'08/18 ~ 09/18'}</div>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper className="usage-card">
            <Typography component="h3">
              {__('次回のお支払日')}
            </Typography>
            <div className="usage-card-content">{'09/18'}</div>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper className="usage-card">
            <Typography component="h3">
              {__('地図表示回数')}
            </Typography>
            <div className="usage-card-content">
              {sprintf(
                _n(
                  '%d map load',
                  '%d map loads',
                  usage?.count || 0,
                ),
                usage?.count || 0,
              )}
              {/* <span className="helper-text">{'回'}</span> */}
            </div>
            {/* {usage?.updated && <> */}
            <div className="updated-at">{sprintf(__('Last updated %s'), moment('2019/09/18').format('YYYY-MM-DD HH:mm:ss'))}</div>
            {/* </>} */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper className="usage-card">
            <Typography component="h3">
              {__('料金')}
            </Typography>
            <div className="usage-card-content">{'¥1,000'}</div>
          </Paper>
        </Grid>
      </Grid>

      <Paper className="payment-info">
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
            {props.isOwner && (
              <>
                { customer && customer.balance < 0 && <TableRow>
                  <TableCell component="th" scope="row">
                    {__('Current account credit:')}
                  </TableCell>
                  <TableCell colSpan={2}>
                    {currencyFormatter.format(Math.abs(customer.balance))}<br />
                    {__('While this account has credits available, payments will deduct from account credit instead of the registered credit card.')}
                  </TableCell>
                </TableRow> }
                <TableRow>
                  <TableCell component="th" scope="row">
                    {__('Payment method:')}
                  </TableCell>
                  <TableCell>
                    {props.last2
                      ? sprintf(__('ending in **%1$s'), props.last2)
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
                {name}
                { subscription && <>
                  <br />
                  { subscription.cancel_at_period_end ?
                    sprintf(__('Scheduled to expire on %1$s'), moment(subscription.current_period_end * 1000).format('YYYY-MM-DD'))
                    :
                    sprintf(__('Will automatically renew on %1$s'), moment(subscription.current_period_end * 1000).format('YYYY-MM-DD'))
                  }
                </>}
              </TableCell>
              <TableCell align="right">
                { subscription && subscription.cancel_at_period_end === true ?
                  <>
                    { resumeSubLoading ?
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
                        disabled={!props.last2 || !props.isOwner}
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
                    disabled={!props.last2 || !props.isOwner}
                  >
                    {__('Change Plan')}
                  </Button>
                }
                <PlanModal
                  open={openPlan}
                  handleClose={() => setOpenPlan(false)}
                  plans={
                    plans.filter(
                      (plan) => !isAppliancePlan(plan),
                    ) as GeoloniaConstantPlan[]
                  }
                  currentPlanId={planId}
                />
              </TableCell>
            </TableRow>
            {/* <TableRow>
                  <TableCell component="th" scope="row">
                    {__("Coupon:")}
                  </TableCell>
                  <TableCell>$200.0</TableCell>
                  <TableCell align="right">
                    <Save label={__("Redeem a coupon")} />
                  </TableCell>
                </TableRow> */}
          </TableBody>
        </Table>
        <p style={{ textAlign: 'right' }}>
          <a href="https://geolonia.com/pricing" target="_blank" rel="noreferrer">
            {__('Learn more about plans on the pricing page.')}
          </a>
        </p>
      </Paper>
    </>;
  }

  return (
    <StripeContainer>
      <div className="billing">
        <Title title={__('Plans and Billing')} breadcrumb={breadcrumbItems}>
          {sprintf(__('You can check and change your current pricing plan and usage status of Team %s.'), teamName)}
        </Title>

        { inner }

        <Paper>
          {props.isOwner && (
            <>
              <Typography component="h2" className="module-title">
                {__('Payment history')}
              </Typography>
              <Receipts />
            </>
          )}
        </Paper>
      </div>
    </StripeContainer>
  );
};

const mapStateToProps = (state: Geolonia.Redux.AppState): StateProps => {
  const team = state.team.data[state.team.selectedIndex];
  return {
    session: state.authSupport.session,
    last2: team && team.last2,
    isOwner: team && team.role === 'Owner',
    memberCount:
      team &&
      state.teamMember[team.teamId] &&
      state.teamMember[team.teamId].data.length,
    team: team,
    language: state.userMeta.language,
  };
};

export default connect(mapStateToProps)(Billing);
