import React from 'react';
import { Grid, CircularProgress } from '@material-ui/core';

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

export default LoadingScreen;
