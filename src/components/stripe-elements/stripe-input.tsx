import * as React from "react";

// import { withStyles } from '@material-ui/styles'

// const styles = () => ({
//   root: {
//     width: '100%',
//     padding: '6px 0 7px',
//     cursor: 'text',
//   },
// })

// @withStyles(styles, { withTheme: true })

type Props = {
  classes: object;
  theme: object;
  Component: Function;
  onBlur: Function;
  onFocus: Function;
  onChange: Function;
};

export default function StripeInput(props: Props) {
  const { Component, onFocus, onBlur, onChange } = props;

  return (
    <Component
      onFocus={onFocus}
      onBlur={onBlur}
      onChange={onChange}
      placeholder=""
    />
  );
}
