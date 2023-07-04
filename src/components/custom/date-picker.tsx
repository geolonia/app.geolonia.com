import React, { useCallback } from 'react';
import TextField from '@material-ui/core/TextField';

type Props = {
  value: string
  label?: string
  disabled?: boolean
  onChange?: (date: string) => void,
};

export const DatePicker = (props: Props) => {

  const {
    value,
    label = 'date',
    disabled = false,
    onChange,
  } = props;

  const onChangeCallback = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (typeof onChange === 'function') {
      const nextDate = e.currentTarget?.value;
      onChange(nextDate);
    }
  }, [onChange]);

  return <TextField
    label={label}
    type={ 'date' }
    disabled={disabled}
    value={ value }
    onChange={ onChangeCallback }
    InputLabelProps={{ shrink: true }}
  />;
};
