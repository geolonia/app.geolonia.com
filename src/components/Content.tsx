import React from 'react';
import PropTypes from 'prop-types';
import { withStyles,Theme } from '@material-ui/core/styles';
import { HashRouter, Route } from 'react-router-dom';

import Dashboard from './Dashboard';

import APIKeys from './Maps/APIKeys';
import APIKey from './Maps/APIKey';

import General from './Team/General';
import Members from './Team/Members';
import Billing from './Team/Billing';

const styles = (theme:Theme) => ({});

type Props= {
  classes: any
}

function Content(props: Props) {
  return (
    <HashRouter>
      <Route exact path='/' component={Dashboard} />
      <Route exact path='/maps/api-keys' component={APIKeys} />
      <Route exact path='/maps/api-keys/:id' component={APIKey} />

      <Route exact path='/team/general' component={General} />
      <Route exact path='/team/members' component={Members} />
      <Route exact path='/team/billing' component={Billing} />
    </HashRouter>
  );
}

Content.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Content);
