import React, { useState, useEffect, useCallback, useMemo } from 'react';

import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Bar } from 'react-chartjs-2';
// import Save from "../custom/Save";
import Title from '../custom/Title';
import PaymentMethodModal from './Billing/payment-method-modal';
import PlanModal from './Billing/plan-modal';
import Receipts from './Billing/Receipts';
import './Billing.scss';

import { __, sprintf} from '@wordpress/i18n';
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
import { colorScheme } from '../../lib/colorscheme';

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
  mapKeys: Geolonia.Key[];
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
  current_period_start: string;
  current_period_end: string;
}

interface CustomerDetails {
  balance: number
  currency: string
}

interface UpcomingDetails {
  amount_due: number
  next_payment_attempt: string
}

interface UsageDetails {
  count: number
  lastLoggedRequest: string
  updated: string,
  details: {
    [s: string]: [
      {
        aggregationUnit: string
        count: number
        date: string
        lastLoggedRequest: string
      }
    ]
  }
}

type ChartDatasets = {
  label?: string,
  data: number[],
  fill: boolean,
  backgroundColor: string,
}[]

const getRangeDate = (startDate: moment.Moment, endDate: moment.Moment) => {
  const dates: moment.Moment[] = [];
  let currentDate: moment.Moment = startDate;
  while (currentDate <= endDate) {
    dates.push(currentDate);
    currentDate = currentDate.clone().add(1, 'days');
  }
  return dates;
};

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
  const [upcoming, setUpcoming] = useState<UpcomingDetails | undefined>(undefined);
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
      setUpcoming(data.upcoming);
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
    upcoming,
    usage,
  };
};

const Billing = (props: StateProps) => {
  const { session, team, language, mapKeys } = props;
  const teamName = team?.name;
  const teamId = team?.teamId;
  const [openPayment, setOpenPayment] = useState(false);
  const [openPlan, setOpenPlan] = useState(false);
  const { loaded, plans, name, planId, subscription, customer, upcoming, usage } = usePlan(props);
  const [resumeSubLoading, setResumeSubLoading] = useState(false);
  const [datasets, setDatasets] = useState<ChartDatasets>([]);
  const [labels, setLabels] = useState<string[]>([]);

  const mapKeyNames = useMemo(() => {
    const out: { [key: string]: string } = {};
    for (const key of mapKeys) {
      out[key.userKey] = key.name;
    }
    return out;
  }, [mapKeys]);

  useEffect(() => {
    if (!usage || !subscription || !usage.details) {
      return;
    }

    // ラベルを用意
    const labelList = getRangeDate(
      moment(subscription.current_period_start), moment(subscription.current_period_end),
    );

    const ymdList = labelList.map((d) => d.format('YYYYMMDD'));

    const chartData: ChartDatasets = [];

    for (const apiKey in usage.details) {
      const detailObj = usage.details[apiKey];
      const apiKeyName = mapKeyNames[apiKey];
      const countData = ymdList.map((ymd) => detailObj.find((d) => d.date === ymd)?.count || 0);
      if (countData.length === 0) continue;

      // チャートの配色
      const colorsMaxIndex = colorScheme.length -1;
      let colorIndex:number = chartData.length;

      // 用意している色数を以上にデータがあった場合
      if (colorIndex > colorsMaxIndex) {
        colorIndex = Math.random() * colorsMaxIndex;
      }

      chartData.push(
        {
          label: apiKeyName,
          data: countData,
          fill: false,
          backgroundColor: colorScheme[colorIndex],
        },
      );
    }

    setDatasets(chartData);
    setLabels(labelList.map((x) => x.format('MM/DD')));

  }, [usage, subscription, mapKeyNames]);

  // チーム変えたらロード状態をリセット
  useEffect(() => {
    setDatasets([]);
  }, [teamId]);

  const data = {
    labels: labels,
    datasets: datasets,
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

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
              {subscription ?
                <>
                  {`${moment(subscription.current_period_start).format('MM/DD')} ~ ${moment(subscription.current_period_end).format('MM/DD')}`}
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
                  {moment(subscription.current_period_end).format('MM/DD')}
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
              {__('Map loads this month')}
            </Typography>
            <div className="usage-card-content">
              {!usage || typeof usage.count !== 'number' ? '-' : usage.count}
            </div>
            {/* NOTE: 未更新時（usage.updated = 1970-01-01T00:00:00Z が API から返ってくる） は、非表示にする */ }
            {(usage?.updated && usage.updated >= '2000-01-01T00:00:00Z') && <>
              <div className="updated-at">{sprintf(__('Last updated %s'), moment(usage.updated).format('YYYY/MM/DD HH:mm:ss'))}</div>
            </>}
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

      <Paper className="usage-details-info">
        <Typography component="h2" className="module-title">
          {__('Map loads by API key')}
        </Typography>
        <Bar data={data} options={options} id={'chart-usage-api-key'} height={100}/>
      </Paper>

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
                    {currencyFormatter.format(Math.abs(customer.balance))}
                    {__(' : While this account has credits available, payments will deduct from account credit instead of the registered credit card.')}
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
                  { subscription.cancel_at_period_end && sprintf(__('Scheduled to expire on %1$s'), moment(subscription.current_period_end).format('YYYY-MM-DD'))}
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
        <Title title={__('Billing and Plans')} breadcrumb={breadcrumbItems}>
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
  const { data: mapKeys = [] } = state.mapKey[team.teamId] || {};
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
    mapKeys,
  };
};

export default connect(mapStateToProps)(Billing);
