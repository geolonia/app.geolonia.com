import React from 'react';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

type Props= {
  label: string,
  handler: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const Save = (props: Props) => {
  const style = {
    marginTop: '1em',
    width: '100%',
  } as React.CSSProperties

  return (
    <Typography style={style} component="p" paragraph={true} align="right"><Button variant="contained" color="primary" onClick={props.handler}>{props.label}</Button></Typography>
  );
}

Save.defaultProps = {
  label: 'Save',
  handler: (event: React.MouseEvent) => {
    console.log(event)
  }
};

export default Save;
