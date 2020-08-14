import React from "react";

import Paper from "@material-ui/core/Paper";
import { withStyles, Theme } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import Hidden from "@material-ui/core/Hidden";
import { sprintf, __ } from "@wordpress/i18n";
import moment from "moment";
import iconPlane from "./custom/plane.svg";

import "./Dashboard.scss";
import { connect } from "react-redux";

import DeveloperBlog from "./DeveloperBlog";

const styles = (theme: Theme) => ({});

type OwnProps = {
  classes: object;
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
        <Hidden smDown>
          <div className="box-icon">
            <img src={iconPlane} alt="" className="icon" />
          </div>
        </Hidden>
        <div className="box-content">
          <h2>{sprintf(__("Welcome, %s"), displayName)}</h2>
          <ul>
            <li>
              <Link href="#/api-keys" color="inherit" underline="always">
                {__("Get API key")}
              </Link>{" "}
              - {__("Get API key then create your map!")}
            </li>
            <li>
              <Link href="#/data/geojson" color="inherit" underline="always">
                {__("GeoJSON API")}
              </Link>{" "}
              - {__("Manage and style your GeoJSON.")}
            </li>
          </ul>
        </div>
      </Paper>

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
