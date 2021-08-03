import React from "react";

import Paper from "@material-ui/core/Paper";
import { withStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { __ } from "@wordpress/i18n";
import moment from "moment";

import "./Dashboard.scss";
import { connect } from "react-redux";

import Tutorials from './Turorials'
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
          <p>まずAPI キーを取得し、地図のデザインや表示位置の初期設定をしてください。<br/> そのあと生成された HTML コードスニペットをあなたの Webサイトに追加すると、作成した地図が表示されます。</p>
          <Button className="create-new" variant="contained" size="large" onClick={() => window.location.href = '/#/api-keys'}>{__("地図を作成する")}</Button>
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
