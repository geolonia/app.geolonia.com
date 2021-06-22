import React, { useState, useEffect, useCallback } from "react";

import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
// import { Line } from "react-chartjs-2";
// import Save from "../custom/Save";
import Title from "../custom/Title";
import PaymentMethodModal from "./Billing/payment-method-modal";
import PlanModal from "./Billing/plan-modal";
import Receipts from "./Billing/Receipts";
import "./Billing.scss";

import { __, sprintf } from "@wordpress/i18n";
import { connect } from "react-redux";

import {
  CircularProgress
} from "@material-ui/core";

// stripe integration
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import moment from "moment";

import customFetch from "../../lib/fetch";
import { Redirect } from "react-router";

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY as string
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
};

type StripeTier = {
  flat_amount: number;
  unit_amount: number;
  up_to: null | number;
};

type ChargeDuration = null | "month"; // Free プラン は null

export type GeoloniaFreePlan = {
  planId: null;
  name: string;
  duration: ChargeDuration;
  contactRequired: undefined;
};

export type GeoloniaConstantPlan = {
  planId: string;
  name: string;
  price: number;
  duration: ChargeDuration;
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

export const parsePlanLabel = (
  plans: GeoloniaPlan[],
  planId: PossiblePlanId
) => {
  let currentPlanName = "";
  let currentDuration: ChargeDuration = null;
  if (planId === null) {
    currentPlanName = __("Free plan");
  } else {
    const currentPlan = plans
      .filter(plan => !isAppliancePlan(plan))
      .find(plan => (plan as GeoloniaConstantPlan).planId === planId);
    if (currentPlan && currentPlan.name === "Pro") {
      currentPlanName = __("Pro plan");
      currentDuration = (currentPlan as GeoloniaConstantPlan).duration;
    }
  }

  if (currentDuration === "month") {
    currentPlanName += " " + __("monthly");
  }
  return currentPlanName;
};

const usePlan = (props: StateProps) => {
  const { session, team } = props;
  const teamId = team?.teamId;
  const [plans, setPlans] = useState<GeoloniaPlan[]>([]);
  // planId === null フリープラン
  // planId === void 0 リクエスト中
  const [planId, setPlanId] = useState<string | null | undefined>(void 0);
  const [subscription, setSubscription] = useState<SubscriptionDetails | undefined>(undefined);
  const [loaded, setLoaded] = useState(false);

  // 全てのプランを取得
  useEffect(() => {
    (async () => {
      const freePlan: GeoloniaFreePlan = {
        planId: null,
        name: __("Free Plan"),
        duration: "month",
        contactRequired: void 0
      };

      const res = await fetch(`https://api.app.geolonia.com/${process.env.REACT_APP_STAGE}/plans`);
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
      return
    }

    (async () => {
      setLoaded(true);
      const res = await customFetch(
        session,
        `https://api.app.geolonia.com/${process.env.REACT_APP_STAGE}/teams/${teamId}/plan`
      );
      const data = await res.json();
      setPlanId(data.planId);
      setSubscription(data.subscription);
    })();
  }, [ loaded, session, teamId, setPlanId, setSubscription ]);

  const currentPlanName = parsePlanLabel(plans, planId);

  return { plans, name: currentPlanName, planId, subscription };
};

const Billing = (props: StateProps) => {
  const { session, team } = props
  const teamId = team?.teamId;
  const [openPayment, setOpenPayment] = useState(false);
  const [openPlan, setOpenPlan] = useState(false);
  const { plans, name, planId, subscription } = usePlan(props);
  const [ resumeSubLoading, setResumeSubLoading ] = useState(false);

  const breadcrumbItems = [
    {
      title: __("Home"),
      href: "#/"
    },
    {
      title: __("Team settings"),
      href: "#/team/general"
    }
  ];

  const resumeSubscriptionHandler = useCallback(async () => {
    if (resumeSubLoading) {
      return
    }

    setResumeSubLoading(true);
    const res = await customFetch(
      session,
      `https://api.app.geolonia.com/${process.env.REACT_APP_STAGE}/teams/${teamId}/plan`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ planId }),
      }
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
    return <Redirect to="/" />
  }

  return (
    <StripeContainer>
      <div className="billing">
        <Title title="Billing" breadcrumb={breadcrumbItems}>
          {__("You can see subscriptions for this team in this month.")}
        </Title>

        <Typography component="h2" className="module-title">
          {__("Payment information")}
        </Typography>
        <Table className="payment-info">
          <TableBody>
            {props.isOwner && (
              <TableRow>
                <TableCell component="th" scope="row">
                  {__("Payment method:")}
                </TableCell>
                <TableCell>
                  {props.last2
                    ? sprintf(__("ending in **%1$s"), props.last2)
                    : ""}
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenPayment(true)}
                    type={"button"}
                  >
                    {__("Change payment method")}
                  </Button>
                  <PaymentMethodModal
                    open={openPayment}
                    handleClose={() => setOpenPayment(false)}
                  />
                </TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell component="th" scope="row">
                {__("Current Plan")}
              </TableCell>
              <TableCell>
                {name}
                { subscription && <>
                  <br />
                  { subscription.cancel_at_period_end ?
                    sprintf(__("Scheduled to expire on %1$s"), moment(subscription.current_period_end * 1000).format("YYYY-MM-DD"))
                    :
                    sprintf(__("Will automatically renew on %1$s"), moment(subscription.current_period_end * 1000).format("YYYY-MM-DD"))
                  }
                </>}
              </TableCell>
              <TableCell align="right">
                { subscription && subscription.cancel_at_period_end === true ?
                  <>
                    { resumeSubLoading ?
                      <CircularProgress
                        size={16}
                        color={"inherit"}
                      />
                      :
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={resumeSubscriptionHandler}
                        type={"button"}
                        disabled={!props.last2 || !props.isOwner}
                      >
                        {__("Resume subscription")}
                      </Button>
                    }
                  </>
                  :
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenPlan(true)}
                    type={"button"}
                    disabled={!props.last2 || !props.isOwner}
                  >
                    {__("Change Plan")}
                  </Button>
                }
                <PlanModal
                  open={openPlan}
                  handleClose={() => setOpenPlan(false)}
                  plans={
                    plans.filter(
                      plan => !isAppliancePlan(plan)
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
      </div>
      <p style={{ textAlign: "right" }}>
        <a href="https://geolonia.com/pricing">
          {__("Learn more about plans on the pricing page.")}
        </a>
      </p>

      {props.isOwner && (
        <>
          <Typography component="h2" className="module-title">
            {__("Payment history")}
          </Typography>
          <Receipts />
        </>
      )}
    </StripeContainer>
  );
};

const mapStateToProps = (state: Geolonia.Redux.AppState): StateProps => {
  const team = state.team.data[state.team.selectedIndex];
  return {
    session: state.authSupport.session,
    last2: team && team.last2,
    isOwner: team && team.role === "Owner",
    memberCount:
      team &&
      state.teamMember[team.teamId] &&
      state.teamMember[team.teamId].data.length,
    team: team,
  };
};

export default connect(mapStateToProps)(Billing);
