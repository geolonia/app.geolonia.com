import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles,Theme } from '@material-ui/core/styles';
import CodeIcon from '@material-ui/icons/Code';
import RoomIcon from '@material-ui/icons/Room';

import { Line } from 'react-chartjs-2';
import moment from 'moment'

import Table from './custom/Table';
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
  {id: 1111, name: "My Map", updated: "2019-08-28", isPublic: true},
  {id: 1112, name: "example.com", updated: "2019-08-28", isPublic: false},
  {id: 1113, name: "example.jp", updated: "2019-08-28", isPublic: true},
];

type Props= {
  classes: any
}

const Dashboard = (props: Props) => {
  const { classes } = props;

  const lastDay = moment().add('months', 1).date(0).date()
  const labels = []
  for (let i = 1; i <= lastDay; i++) {
    labels.push(i)
  }

  console.log(labels)

  const mapChartData = {
    labels: labels,
    datasets: [
      {
        borderColor: '#ffffff',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        data: [100, 110, 120, 150, 167, 170, 200, 500, 800, 1200, 1400],
      },
    ],
  }

  const geoAPIChartData = {
    labels: labels,
    datasets: [
      {
        borderColor: '#ffffff',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        data: [3000, 4000, 5000, 7000, 8000, 12000, 13000, 52000, 56000, 58000],
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
      <h1 className="app-title">Welcome, miya0001!</h1>

      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={12}>
          <p>ここに Getting Started 的なコンテンツ</p>
        </Grid>

        <Grid item sm={12} md={6}>
          <Paper className="container-map-loads">
            <Typography component="h2" className="module-title">Map loads</Typography>
            <div className="chart-container">
              <Line data={mapChartData} options={chartOptions} />
            </div>
          </Paper>
        </Grid>

        <Grid item sm={12} md={6}>
          <Paper className="container-geo-api-loads">
            <Typography component="h2" className="module-title">Geo API loads</Typography>
            <div className="chart-container">
              <Line data={geoAPIChartData} options={chartOptions} />
            </div>
          </Paper>
        </Grid>

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
