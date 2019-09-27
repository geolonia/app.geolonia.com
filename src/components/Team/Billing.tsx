import React from "react";

import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { Line } from "react-chartjs-2";
import { __ } from "@wordpress/i18n";

import Save from "../custom/Save";
import Title from "../custom/Title";
import "./Billing.scss";

const Content = () => {
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

  const breadcrumbItems = [
    {
      title: "Home",
      href: "#/"
    },
    {
      title: "Team settings",
      href: "#/team"
    },
    {
      title: "General",
      href: null
    }
  ];

  return (
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
          <h3 className="title">{__("Cost per user/month")}</h3>
          <p className="value">$6.0</p>
        </div>
        <div className="item">
          <h3 className="title">{__("Users")}</h3>
          <p className="value">11</p>
        </div>
        <div className="item subtotal">
          <p className="value">$66.0</p>
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

      <Typography component="h2" className="module-title">
        {__("Payment information")}
      </Typography>
      <Table className="payment-info">
        <TableBody>
          <TableRow>
            <TableCell component="th" scope="row">
              {__("Payment method:")}
            </TableCell>
            <TableCell>Visa ending in 1111</TableCell>
            <TableCell align="right">
              <Save label={__("Change payment method")} />
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
    </div>
  );
};

export default Content;
