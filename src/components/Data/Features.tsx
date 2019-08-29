import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles,Theme } from '@material-ui/core/styles';

const styles = (theme:Theme) => ({
  // paper: {
  //   maxWidth: 936,
  //   margin: 'auto',
  //   overflow: 'hidden',
  // },
  // searchBar: {
  //   borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  // },
  // searchInput: {
  //   fontSize: theme.typography.fontSize,
  // },
  // block: {
  //   display: 'block',
  // },
  // addUser: {
  //   marginRight: theme.spacing(1),
  // },
  // contentWrapper: {
  //   margin: '40px 16px',
  // },
});

type Props= {
  classes: any
}

function Content(props: Props) {
  const { classes } = props;

  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={6}>
        <Paper>
          <Typography component="h3">
            API
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper>
          <Typography component="h3">
            This is a sheet of paper.
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}

Content.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Content);
