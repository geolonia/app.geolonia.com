import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles,Theme } from '@material-ui/core/styles';
import CodeIcon from '@material-ui/icons/Code';
import RoomIcon from '@material-ui/icons/Room';
import Link from '@material-ui/core/Link';
import Hidden from '@material-ui/core/Hidden';

import { Line } from 'react-chartjs-2';
import moment from 'moment'

import Table from './custom/Table';
import iconPlane from './custom/plane.svg';

import './Dashboard.scss'

const styles = (theme:Theme) => ({

});

// TODO: Followings are mock data.
const rowsAPIKeys = [
  {id: 1111, name: "My Map", updated: "2019-08-28"},
  {id: 1112, name: "example.com", updated: "2019-08-28"},
  {id: 1113, name: "example.jp", updated: "2019-08-28"},
];

const rowsFeatures = [
  {id: 1111, name: "和歌山県公衆トイレ", updated: "2019-08-28", isPublic: true},
  {id: 1112, name: "USGS Earthquake", updated: "2019-08-28", isPublic: false},
  {id: 1113, name: "テスト", updated: "2019-08-28", isPublic: true},
];

type Props= {
  classes: any
}

const Dashboard = (props: Props) => {
  const { classes } = props;

  const lastDay = moment().add(1, 'months').date(0).date()
  const labels = []
  for (let i = 1; i <= lastDay; i++) {
    if (1 === i || 0 === (i % 5) || i === lastDay) {
      labels.push(i)
    } else {
      labels.push('')
    }
  }

  const mapChartData = {
    labels: labels,
    datasets: [
      {
        borderColor: '#ffffff',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        data: [1221, 2633, 3941, 4992, 6233, 7586],
      },
    ],
  }

  const geoAPIChartData = {
    labels: labels,
    datasets: [
      {
        borderColor: '#ffffff',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        data: [0, 0, 3423, 4865, 5766, 7223],
      },
    ],
  }

  const chartOptions = {
    legend: {
      display: false,
    },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      xAxes: [{
        ticks: {
          min: 0,
          fontColor: '#ffffff',
        },
        gridLines: {
          color: 'rgba(255, 255, 255, 0.4)',
        },
      }],
      yAxes: [{
        ticks: {
          min: 0,
          fontColor: '#ffffff',
        },
        gridLines: {
          color: 'rgba(255, 255, 255, 0.4)',
        },
      }],
    }
  }

  return (
    <div id="dashboard">
      <Paper className="getting-started">
        <Hidden smDown>
          <div className="box-icon">
            <img src={iconPlane} alt="" className="icon" />
          </div>
        </Hidden>
        <div className="box-content">
          <h2>Welcome, miya0001!</h2>
          <ul>
            <li><Link href="#/maps/api-keys" color="inherit" underline="always">Get API key</Link> - Get API key to create your map!</li>
            <li><Link href="#/data/features" color="inherit" underline="always">Geolonia Locations</Link> - Display your points, lines, polygons on your map application.</li>
          </ul>
        </div>
      </Paper>

      <Grid container className={classes.root} spacing={2}>

        <Grid item xs={12} md={6}>
          <Paper className="container-map-loads">
            <Typography component="h2" className="module-title">Map loads for this month</Typography>
            <div className="chart-container">
              <Line data={mapChartData} options={chartOptions} />
            </div>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper className="container-geo-api-loads">
            <Typography component="h2" className="module-title">API loads for this month</Typography>
            <div className="chart-container">
              <Line data={geoAPIChartData} options={chartOptions} />
            </div>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper>
            <Typography component="h2" className="module-title"><CodeIcon /> API Keys</Typography>
            <Table rows={rowsAPIKeys} permalink="/maps/api-keys/%s" />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper>
            <Typography component="h2" className="module-title"><RoomIcon /> Locations</Typography>
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
