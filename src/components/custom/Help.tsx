import React from 'react';
import Paper from '@material-ui/core/Paper';

type Props = {
  children: any,
}

const Help = (props: Props) => {

  const style: React.CSSProperties = {
    fontSize: '140%',
    width: '100%',
    backgroundColor: '#41C464',
    color: '#ffffff',
    marginBottom: '1em',
  }

  return (
    <Paper style={style}>{props.children}</Paper>
  );
}

Help.defaultProps = {
  children: "",
};

export default Help;
