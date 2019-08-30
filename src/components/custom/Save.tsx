import React from 'react';

import Button from '@material-ui/core/Button';

type Props= {}

const Code = (props: Props) => {
  const style = {
    margin: '1em 0',
    textAlign: 'right',
  } as React.CSSProperties

  return (
    <p style={style}><Button variant="contained" color="primary">Save</Button></p>
  );
}

export default Code;
