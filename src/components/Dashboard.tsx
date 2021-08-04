import React from "react";

import Paper from "@material-ui/core/Paper";
import { withStyles, Theme } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import InfoIcon from "@material-ui/icons/Info";
import { __ } from "@wordpress/i18n";
import moment from "moment";

import "./Dashboard.scss";
import { connect } from "react-redux";

import Tutorials from "./Turorials";
import DeveloperBlog from "./DeveloperBlog";

const styles = (theme: Theme) => ({});

type OwnProps = {
  classes: { [key: string]: string };
};

type StateProps = {
  userMeta: Geolonia.User;
  session: Geolonia.Session;
};

type Props = OwnProps & StateProps;

const Dashboard = (props: Props) => {
  const { userMeta } = props;

  const lastDay = moment()
    .add(1, "months")
    .date(0)
    .date();

  const labels = [];

  for (let i = 1; i <= lastDay; i++) {
    if (1 === i || 0 === i % 5 || i === lastDay) {
      labels.push(i);
    } else {
      labels.push("");
    }
  }

  const payload = props.session ? props.session.getIdToken().payload : {};
  const displayName = (userMeta.name ||
    payload["cognito:username"] ||
    "") as string;

  return (
    <div id="dashboard">

      <Paper className="getting-started">
        <div className="box-content">
          <h2>{__("Get started with Geolonia map")}</h2>
          <ul>
            <li>
              <Link href="#/api-keys" color="inherit" underline="always">
                {__("Display a map")}
              </Link>{" "}
              - {__("Create API key then add the map to your web site")}
            </li>
            <li>
              <Link href="#/data/geojson" color="inherit" underline="always">
                {__("Upload your data")}
              </Link>{" "}
              - {__("Display CSV or GeoJSON in your map")}
            </li>
            <li>
              <Link
                href="https://docs.geolonia.com/"
                color="inherit"
                underline="always"
                target="_blank"
                rel="noopener noreferrer"
              >
                {__("Build a custom map")}
              </Link>{" "}
              - {__("Browse developer docs")}
            </li>
          </ul>
        </div>
      </Paper>

      <h2 style={{ marginTop: "32px" }}>{__("Tutorials")}</h2>
      <Tutorials></Tutorials>

      <h2 style={{ marginTop: "32px" }}>{__("Developer's Blog")}</h2>
      <DeveloperBlog />
    </div>
  );
};

const mapStateToProps = (state: Geolonia.Redux.AppState) => ({
  userMeta: state.userMeta,
  session: state.authSupport.session
});
const ConnectedDashboard = connect(mapStateToProps)(Dashboard);

export default withStyles(styles)(ConnectedDashboard);
