import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles,Theme } from '@material-ui/core/styles';

import CodeIcon from '@material-ui/icons/Code';
import RoomIcon from '@material-ui/icons/Room';

import Table from './custom/Table';
import './Dashboard.scss'

const styles = (theme:Theme) => ({

});

// TODO: Followings are mock data.
const rowsAPIKeys = [
  {id: 1111, name: "My Map", updated: "2019-08-28"},
  {id: 1112, name: "exmaple.com", updated: "2019-08-28"},
  {id: 1113, name: "exmaple.jp", updated: "2019-08-28"},
];

const rowsFeatures = [
  {id: 1111, name: "My Map", updated: "2019-08-28", isPublic: true},
  {id: 1112, name: "exmaple.com", updated: "2019-08-28", isPublic: false},
  {id: 1113, name: "exmaple.jp", updated: "2019-08-28", isPublic: true},
];

type Props= {
  classes: any
}

const Dashboard = (props: Props) => {
  const { classes } = props;

  return (
    <div id="dashboard">
      <Typography component="h2">Welcome, miya0001!</Typography>

      <Grid container className={classes.root} spacing={2}>
        <Grid item sm={12} md={6}>
          <Paper>
            <Typography component="h2" className="module-title"><CodeIcon /> API Keys</Typography>
            <Table rows={rowsAPIKeys} permalink="/maps/api-keys/%s" />
          </Paper>
        </Grid>

        <Grid item sm={12} md={6}>
          <Paper>
            <Typography component="h2" className="module-title"><RoomIcon /> Features</Typography>
            <Table rows={rowsFeatures} permalink="/data/features/%s" />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);
