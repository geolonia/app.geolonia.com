import React from 'react';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

type Props= {}

const Code = (props: Props) => {
  const style = {
    marginTop: '1em',
  } as React.CSSProperties

  return (
    <Typography style={style} component="p" paragraph={true} align="right"><Button variant="contained" color="primary">Save</Button></Typography>
  );
}

export default Code;
