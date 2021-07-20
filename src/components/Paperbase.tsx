import React, { useState, useEffect } from "react";

import { withStyles, createStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import { CircularProgress } from "@material-ui/core";
import { HashRouter, Route, Switch } from "react-router-dom";

import RouteController from "./route-controller";
import Navigator from "./Navigator";
import Router from "./Router";
import Header from "./Header";
import Footer from "./Footer";
import Signup from "./Signup";
import Verify from "./verify";
import ResendCode from "./resend-code";
import Signin from "./Signin";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import AcceptInvitation from "./AcceptInvitation";

import { theme } from "../assets/mui-theme";

// redux
import { connect } from "react-redux";
import Alert from "./custom/Alert";
import { __ } from "@wordpress/i18n";

import { Roles } from "../constants";

const drawerWidth = 256;
const styles = createStyles({
  root: {
    display: "flex",
    minHeight: "100vh"
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  headerColor: {
    color: '#ffffff',
  },
  appContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column"
  },
  notificationContent: {
    padding: "48px 36px 48px",
    background: "#ffffff"
  },
  warningContent: {
    padding: "48px 36px 48px",
    border: "1px solid #ff0000"
  },
  mainContent: {
    flex: 1,
    padding: "48px 36px 48px",
    background: "#ececec"
  }
});

type OwnProps = {
  classes: {
    root: string;
    drawer: string;
    headerColor: string;
    appContent: string;
    notificationContent: string;
    warningContent: string;
    mainContent: string;
  };
};
type StateProps = {
  session: Geolonia.Session;
  isReady: boolean;
  teams: Geolonia.Team[];
  currentTeam?: Geolonia.Team;
  currentRole?: Geolonia.Role;
  userMeta: Geolonia.User;
};
type Props = OwnProps & StateProps;

export const Paperbase: React.FC<Props> = (props: Props) => {
  const { classes, isReady, session, currentRole } = props;

  const isLoggedIn = isReady && !!session;

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  if (!isReady) {
    return (
      <ThemeProvider theme={theme}>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minHeight: "100vh" }}
        >
          <Grid item xs={3}>
            <CircularProgress></CircularProgress>
          </Grid>
        </Grid>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline />
        <HashRouter>
          <Route
            path="/"
            render={(props: any) => {
              return <RouteController {...props} isLoggedIn={isLoggedIn} />;
            }}
          />
          <Switch>
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/verify" component={Verify} />
            <Route exact path="/resend" component={ResendCode} />
            <Route exact path="/signin" component={Signin} />
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <Route exact path="/reset-password" component={ResetPassword} />
            <Route
              exact
              path="/accept-invitation/:invitationToken/:teamId"
              component={AcceptInvitation}
            />
            <Route exact>
              <nav className={`${classes.drawer} ${classes.headerColor}`}>
                <Hidden smUp implementation="js">
                  <Navigator
                    PaperProps={{ style: { width: drawerWidth } }}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                  />
                </Hidden>
                <Hidden xsDown implementation="css">
                  <Navigator PaperProps={{ style: { width: drawerWidth } }} />
                </Hidden>
              </nav>
              <div className={classes.appContent}>
                <Header onDrawerToggle={handleDrawerToggle} />
                <main className={classes.mainContent}>
                  {currentRole === Roles.Suspended && (
                    <Alert type={"warning"}>
                      {__("You are suspended. Please contact the team owner.")}
                    </Alert>
                  )}
                  <Router />
                </main>
                <Footer />
              </div>
            </Route>
          </Switch>
        </HashRouter>
      </div>
    </ThemeProvider>
  );
};

const mapStateToProps = (state: Geolonia.Redux.AppState): StateProps => {
  // map Teams
  const selectedTeamIndex = state.team.selectedIndex;
  const teams = state.team.data;
  const currentTeam = state.team.data[selectedTeamIndex] as
    | Geolonia.Team
    | undefined;
  const currentRole = currentTeam ? currentTeam.role : void 0;

  // map UserMeta
  const userMeta = state.userMeta;

  return {
    isReady: state.authSupport.isReady,
    session: state.authSupport.session,
    teams,
    currentTeam,
    currentRole,
    userMeta
  };
};

const ConnectedPaperbase = connect(mapStateToProps)(Paperbase);

export default withStyles(styles)(ConnectedPaperbase);
