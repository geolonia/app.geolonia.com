import React from "react";

import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import { Line } from "react-chartjs-2";
import Save from "../custom/Save";
import Title from "../custom/Title";
import PaymentMethodModal from "./payment-method-modal";
import PlanModal from "./plan-modal";
import PriceCard from "../custom/price-card";
import Grid from "@material-ui/core/Grid";
import "./Billing.scss";

import { __, sprintf } from "@wordpress/i18n";
import { connect } from "react-redux";

// stripe integration
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { AppState, Session } from "../../types";
import customFetch from "../../lib/fetch";

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY as string
);

// connect with Stripe
const StripeContainer = (props: { children: React.ReactNode }) => {
  return <Elements stripe={stripePromise}>{props.children}</Elements>;
};

const chartStyle: React.CSSProperties = {
  width: "100%",
  height: "250px",
  margin: "2em 0"
};

const chartData = {
  labels: [
    "Oct",
    "Nov",
    "Dec",
    "Jan, 2019",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep"
  ],
  datasets: [
    {
      borderColor: "rgba(0, 149, 221, 1)",
      backgroundColor: "rgba(0, 149, 221, 0.2)",
      data: [400, 500, 300, 456, 500, 700, 720, 710, 800, 910, 1000, 110]
    }
  ]
};

const chartOptions = {
  legend: {
    display: false
  },
  maintainAspectRatio: false,
  responsive: true,
  scales: {
    yAxes: [
      {
        ticks: {
          min: 0
        }
      }
    ]
  }
};

type StateProps = {
  session: Session;
  last2?: string;
  isOwner?: boolean;
  memberCount?: number;
  teamId?: string;
};

type StripeTier = {
  flat_amount: number;
  unit_amount: number;
  up_to: null | number;
};

export type GeoloniaConstantPlan = {
  planId: string;
  name: string;
  price: number;
  duration: "month" | "year";
  maxMemberLength: number;
  contactRequired: undefined;
};

type GeoloniaAppliancePlan = {
  name: string;
  contactRequired: boolean;
  unitPrice: number;
};

type GeoloniaPlan = GeoloniaConstantPlan | GeoloniaAppliancePlan;

const isAppliancePlan = (plan: GeoloniaPlan): plan is GeoloniaAppliancePlan => {
  return plan.contactRequired === true;
};

const usePlan = (props: StateProps) => {
  const { session, teamId } = props;
  const [plans, setPlans] = React.useState<GeoloniaPlan[]>([]);
  // planId === null フリープラン
  // planId === void 0 リクエスト中
  const [planId, setPlanId] = React.useState<string | null | undefined>(void 0);
  const [loaded, setLoaded] = React.useState(false);

  // get plan list
  React.useEffect(() => {
    fetch(`https://api.app.geolonia.com/${process.env.REACT_APP_STAGE}/plans`)
      .then(res => res.json())
      .then(data => {
        setPlans(data);
      });
  }, []);

  React.useEffect(() => {
    // 現在のプランを取得する
    if (session && teamId && !loaded) {
      setLoaded(true);
      customFetch(
        session,
        `https://api.app.geolonia.com/${process.env.REACT_APP_STAGE}/teams/${teamId}/plan`
      )
        .then(res => res.json())
        .then(data => {
          console.log(data);
          setPlanId(data.planId);
        });
    }
  }, [loaded, session, teamId]);

  let currentPlanName = "";
  if (planId === null) {
    currentPlanName = __("Free plan");
  } else {
    const currentPlan = plans
      .filter(plan => !isAppliancePlan(plan))
      .find(plan => (plan as GeoloniaConstantPlan).planId === planId);
    if (currentPlan) {
      currentPlanName = `${currentPlan.name} ${
        (currentPlan as GeoloniaConstantPlan).duration
      }ly`;
    }
  }

  return { plans, name: currentPlanName, planId };
};

const Billing = (props: StateProps) => {
  const [openPayment, setOpenPayment] = React.useState(false);
  const [openPlan, setOpenPlan] = React.useState(false);
  const { plans, name, planId } = usePlan(props);

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

  return (
    <StripeContainer>
      <div className="billing">
        <Title title="Billing" breadcrumb={breadcrumbItems}>
          {__("You can see subscriptions for this team in this month.")}
        </Title>

        {/* <Grid container spacing={2}>
          {plans.map(plan => {
            if (isAppliancePlan(plan)) {
              return (
                <Grid key={"appliance"} item md={4} sm={12}>
                  <PriceCard
                    title={plan.name}
                    color={"green"}
                    price={plan.unitPrice}
                    unit={__("month * person")}
                    features={["aaa", "bbb"]}
                  ></PriceCard>
                </Grid>
              );
            } else {
              return (
                <Grid key={plan.planId} item md={4} sm={12}>
                  <PriceCard
                    title={plan.name}
                    color={"green"}
                    price={plan.price}
                    unit={__("month")}
                    features={["aaa", "bbb"]}
                  ></PriceCard>
                </Grid>
              );
            }
          })}
        </Grid> */}

        <Grid container spacing={2}>
          <Grid item md={4} sm={12}>
            <PriceCard
              title={"Pro プラン"}
              pricePerMonth={9}
              pricePerYear={99}
              features={["APIKeyの取得", "地図の作成", "位置情報ホスティング"]}
            ></PriceCard>
          </Grid>
          <Grid item md={4} sm={12}>
            <PriceCard
              title={"Pro プラン Silver"}
              pricePerMonth={30}
              pricePerYear={330}
              features={[
                "APIKeyの取得",
                "地図の作成",
                "位置情報ホスティング",
                "チームの作成",
                "チームメンバーの追加（最大5名）",
                "位置情報の同時編集機能"
              ]}
            ></PriceCard>
          </Grid>
          <Grid item md={4} sm={12}>
            <PriceCard
              title={"Geolonia Appliance"}
              pricePerPersonPerMonth={5}
              features={[
                "APIKeyの取得",
                "地図の作成",
                "位置情報ホスティング",
                "チームの作成",
                "チームメンバーの追加（制限なし）",
                "位置情報の同時編集機能",
                "プレミアムサポート"
              ]}
            ></PriceCard>
          </Grid>
        </Grid>

        {/* <Typography component="h2" className="module-title">
          {__("Payment history")}
        </Typography>
        <div style={chartStyle}>
          <Line data={chartData} options={chartOptions} />
        </div> */}

        {/* <Typography component="h2" className="module-title">
          {__("Your subscriptions")}
        </Typography> */}

        {/* <div className="billing-container">
          <div className="item">
            <h3 className="title">{__("Cost per 1,000 map loads/month")}</h3>
            <p className="value">$3.0</p>
            <p className="billed-on">{__("Free for up to 50,000/month")}</p>
          </div>
          <div className="item">
            <h3 className="title">{__("Loads")}</h3>
            <p className="value">85,000</p>
          </div>
          <div className="item subtotal">
            <p className="value">$105.0</p>
          </div>
        </div>

        <div className="billing-container">
          <div className="item">
            <h3 className="title">{__("Cost per 1,000 API loads/month")}</h3>
            <p className="value">$1.0</p>
            <p className="billed-on">{__("Free for up to 50,000/month")}</p>
          </div>
          <div className="item">
            <h3 className="title">{__("Loads")}</h3>
            <p className="value">85,000</p>
          </div>
          <div className="item subtotal">
            <p className="value">$35.0</p>
          </div>
        </div>

        <div className="billing-container">
          <div className="item">
            <h3 className="title">{__("Plans")}</h3>
            <p className="value">
              {props.memberCount && props.memberCount > 1
                ? __("Team Plan")
                : __("Free Plan")}
            </p>
          </div>
          <div className="item">
            <h3 className="title">{__("Users")}</h3>
            <p className="value">
              {props.memberCount ? props.memberCount : ""}
            </p>
          </div>
          <div className="item subtotal">
            <p className="value">{"作成中"}</p>
          </div>
        </div>

        <div className="billing-container no-border">
          <div className="item empty"></div>
          <div className="item empty"></div>
          <div className="item subtotal">
            <h3 className="title">{__("Amount")}</h3>
            <p className="value amount">$206.0</p>
            <p className="billed-on">
              {__("Billed monthly on")}
              <br />
              Oct 1st, 2019
            </p>
          </div>
        </div> */}

        {props.isOwner && (
          <>
            <Typography component="h2" className="module-title">
              {__("Payment information")}
            </Typography>
            <Table className="payment-info">
              <TableBody>
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
                <TableRow>
                  <TableCell component="th" scope="row">
                    {__("Current Plan")}
                  </TableCell>
                  <TableCell>{name}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setOpenPlan(true)}
                      type={"button"}
                      disabled={!props.last2}
                    >
                      {__("Change Plan")}
                    </Button>
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
          </>
        )}
      </div>
    </StripeContainer>
  );
};

const mapStateToProps = (state: AppState): StateProps => {
  const team = state.team.data[state.team.selectedIndex];
  return {
    session: state.authSupport.session,
    last2: team && team.last2,
    isOwner: team && team.role === "Owner",
    memberCount:
      team &&
      state.teamMember[team.teamId] &&
      state.teamMember[team.teamId].data.length,
    teamId: team && team.teamId
  };
};

export default connect(mapStateToProps)(Billing);
