import React, { useMemo, useState } from 'react';
import { FormControl, InputLabel, Input, InputAdornment, IconButton, FormHelperText } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

type Props = {
  labelText: string
  value: string
  helperText?: string
};

const style: React.CSSProperties = {
  padding: '9px 16px',
  backgroundColor: '#444444',
  whiteSpace: 'pre-wrap',
  color: '#ffffff',
  fontSize: '12px',
  fontFamily: 'monospace',
};


const HiddenCode: React.FC<Props> = (props) => {
  const [showSecretKey, setShowSecretKey] = useState(false);

  const elementId = useMemo(() => {
    return `hiddenCode-${(Math.random() + 1).toString(36).substring(7)}`;
  }, []);

  return <FormControl
    fullWidth={true}
  >
    <InputLabel htmlFor={elementId}>{props.labelText}</InputLabel>
    <Input
      id={elementId}
      type={showSecretKey ? 'text' : 'password'}
      value={props.value}
      readOnly={true}
      style={style}
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle secret API key visibility"
            onClick={() => setShowSecretKey((x) => !x)}
          >
            {showSecretKey ? <Visibility htmlColor='#fff' /> : <VisibilityOff htmlColor='#fff' />}
          </IconButton>
        </InputAdornment>
      }
    />
    { props.helperText &&
      <FormHelperText>
        {props.helperText}
      </FormHelperText>
    }
  </FormControl>;
};

export default HiddenCode;
