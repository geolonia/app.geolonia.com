import React from "react";

import { withStyles, createStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import { HashRouter, Route, Switch } from "react-router-dom";
import RouteController from "./route-controller";

import Navigator from "./Navigator";
import Router from "./Router";
import Header from "./Header";
import Footer from "./Footer";
import { theme } from "../assets/mui-theme";

import Signup from "./Signup";
import Verify from "./verify";
import Signin from "./Signin";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

import { connect } from "react-redux";
import { AppState } from "../redux/store";

import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";
import { CircularProgress } from "@material-ui/core";

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
  appContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column"
  },
  mainContent: {
    flex: 1,
    padding: "48px 36px 48px",
    background: "#ffffff"
  }
});

type Props = {
  classes: {
    root: string;
    drawer: string;
    appContent: string;
    mainContent: string;
  };
  // stateProps
  session?: AmazonCognitoIdentity.CognitoUserSession;
  isReady: boolean;
};

export const Paperbase: React.FC<Props> = (props: Props) => {
  const { classes, isReady, session } = props;

  const isLoggedIn = isReady && !!session;

  const [mobileOpen, setMobileOpen] = React.useState(false);

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
            <Route exact path="/signin" component={Signin} />
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <Route exact path="/reset-password" component={ResetPassword} />
            <Route exact>
              <nav className={classes.drawer}>
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

const mapStateToProps = (state: AppState) => ({
  isReady: state.authSupport.isReady,
  session: state.authSupport.session
});

const ConnectedPaperbase = connect(mapStateToProps)(Paperbase);

export default withStyles(styles)(ConnectedPaperbase);
