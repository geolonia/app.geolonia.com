import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { HashRouter, Route } from 'react-router-dom';

import Dashboard from './Dashboard';

import APIKeys from './Maps/APIKeys';
import APIKey from './Maps/APIKey';

import GeoJsons from './Data/GeoJsons';
import GeoJson from './Data/GeoJson';

import General from './Team/general';
import Members from './Team/members';
import Billing from './Team/Billing';

import User from './User/User';

const styles = () => ({});

function Router() {
  return (
    <HashRouter>
      <Route exact path="/" component={Dashboard} />
      <Route exact path="/api-keys" component={APIKeys} />
      <Route exact path="/api-keys/:id" component={APIKey} />

      <Route exact path="/data/geojson" component={GeoJsons} />
      <Route exact path="/data/geojson/:id" component={GeoJson} />

      <Route exact path="/team/general" component={General} />
      <Route exact path="/team/members" component={Members} />
      <Route exact path="/team/billing" component={Billing} />

      <Route exact path="/user" component={User} />
    </HashRouter>
  );
}

export default withStyles(styles)(Router);
