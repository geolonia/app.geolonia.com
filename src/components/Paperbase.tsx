import React, { Suspense, useCallback, useEffect, useState } from 'react';

import { withStyles, createStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import { CircularProgress } from '@material-ui/core';
import type { Location } from 'history';
import { Route, Switch, useHistory } from 'react-router-dom';

import RouteController from './route-controller';
import Navigator from './Navigator';
import Router from './Router';
import Header from './Header';
import Footer from './Footer';
import Signup from './Signup';
import Verify from './verify';
import ResendCode from './resend-code';
import Signin from './Signin';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import CommonNotification from './CommonNotification';

import { theme } from '../assets/mui-theme';

import {
  useAppSelector,
  useSelectedTeam,
} from '../redux/hooks';

import Alert from './custom/Alert';
import { __ } from '@wordpress/i18n';

import { Roles } from '../constants';
import mixpanel from 'mixpanel-browser';
import classNames from 'classnames';

const drawerWidth = 256;
const styles = createStyles({
  root: {
    display: 'flex',
    minHeight: '100vh',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  headerColor: {
    color: '#ffffff',
  },
  appContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  notificationContent: {
    padding: '48px 36px 48px',
    background: '#ffffff',
  },
  warningContent: {
    padding: '48px 36px 48px',
    border: '1px solid #ff0000',
  },
  mainContent: {
    flex: 1,
    padding: '48px 36px 48px',
    background: '#ececec',
  },
});

type Props = {
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

const LoadingScreen: React.FC = () => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '100vh' }}
    >
      <Grid item>
        <CircularProgress />
      </Grid>
    </Grid>
  );
};

export const Paperbase: React.FC<Props> = (props: Props) => {
  const history = useHistory();
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = useCallback(() => setMobileOpen((mobileOpen) => !mobileOpen), []);
  const { classes } = props;
  const { isReady, isLoggedIn } = useAppSelector((state) => state.authSupport);
  const { selectedTeam } = useSelectedTeam();

  useEffect(() => {
    if (!history) return;
    const trackLocation = (location: Location) => {
      mixpanel.track('Pageview', { path: location.pathname });
    };
    trackLocation(history.location);
    const unregister = history.listen(trackLocation);
    return () => {
      unregister();
    };
  }, [ history ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [ selectedTeam?.teamId ]);

  if (!isReady) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Suspense fallback={<LoadingScreen />}>
        <div className={classes.root}>
          <CssBaseline />
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
            <Route exact>
              <nav className={classNames(classes.drawer, classes.headerColor)}>
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
              <Suspense fallback={<div className={classes.appContent}><LoadingScreen /></div>}>
                <div className={classes.appContent}>
                  <Header onDrawerToggle={handleDrawerToggle} />
                  <main className={classes.mainContent}>
                    {selectedTeam && selectedTeam.role === Roles.Suspended && (
                      <Alert type={'warning'}>
                        {__('You are suspended. Please contact the team owner.')}
                      </Alert>
                    )}
                    <Router />
                  </main>
                  <Footer />
                </div>
              </Suspense>
            </Route>
          </Switch>
        </div>
        <CommonNotification />
      </Suspense>
    </ThemeProvider>
  );
};

export default withStyles(styles)(Paperbase);
