import React from "react";

import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import { Line } from "react-chartjs-2";
import { __, sprintf } from "@wordpress/i18n";
import { connect } from "react-redux";

import Save from "../custom/Save";
import Title from "../custom/Title";
import PaymentMethodModal from "./payment-method-modal";
import "./Billing.scss";

// stripe integration
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { AppState } from "../../types";

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY as string
);

// connect with Stripe
const StripeContainer = (props: { children: React.ReactNode }) => {
  return <Elements stripe={stripePromise}>{props.children}</Elements>;
};

const { REACT_APP_STAGE } = process.env;

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
  last2?: string;
  isOwner: boolean;
  memberCount?: number;
};

type StripeTier = {
  flat_amount: number;
  unit_amount: number;
  up_to: null | number;
};

type GeoloniaPlan = {
  seat: {
    id: string;
    tiers: StripeTier[];
  };
};

const Billing = (props: StateProps) => {
  const [open, setOpen] = React.useState(false);

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

        <Typography component="h2" className="module-title">
          {__("Payment history")}
        </Typography>
        <div style={chartStyle}>
          <Line data={chartData} options={chartOptions} />
        </div>

        <Typography component="h2" className="module-title">
          {__("Your subscriptions")}
        </Typography>

        <div className="billing-container">
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
        </div>

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
                      onClick={() => setOpen(true)}
                      type={"button"}
                    >
                      {__("Change payment method")}
                    </Button>
                    <PaymentMethodModal
                      open={open}
                      handleClose={() => setOpen(false)}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    {__("Coupon:")}
                  </TableCell>
                  <TableCell>$200.0</TableCell>
                  <TableCell align="right">
                    <Save label={__("Redeem a coupon")} />
                  </TableCell>
                </TableRow>
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
  const memberCount =
    state.teamMember[team.teamId] && state.teamMember[team.teamId].data.length;

  return {
    last2: team.last2,
    isOwner: team.role === "Owner",
    memberCount
  };
};

export default connect(mapStateToProps)(Billing);
