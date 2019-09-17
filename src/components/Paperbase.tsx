import React from 'react';

import {  withStyles, createStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Hidden from '@material-ui/core/Hidden';
import { HashRouter, Route, Switch } from 'react-router-dom';

import Navigator from './Navigator';
import Router from './Router';
import Header from './Header';
import Footer from './Footer';
import {theme} from '../assets/mui-theme'

import Signup from './Signup'
import Verify from './verify'
import Signin from './Signin'
import ForgotPassword from './ForgotPassword'
import ResetPassword from './ResetPassword'

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
  appContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  mainContent: {
    flex: 1,
    padding: '48px 36px 48px',
    background: '#ffffff',
  },
})

type Props = {
  classes : {
    root: string
    drawer: string
    appContent: string
    mainContent: string
  }
}

export const Paperbase: React.FC<Props> = (props: Props) => {
  const { classes } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen)

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline />
        <HashRouter>
          <Switch>
            <Route exact path='/signup' component={Signup} />
            <Route exact path='/verify' component={Verify} />
            <Route exact path='/signin' component={Signin} />
            <Route exact path='/forgot-password' component={ForgotPassword} />
            <Route exact path='/reset-password' component={ResetPassword} />
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
}

export default withStyles((styles))(Paperbase);
