import React, { useCallback, useState } from 'react';

// Components
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';
import { CircularProgress } from '@material-ui/core';

// Utils
import { __ } from '@wordpress/i18n';

type Props = {
  disabled?: boolean;
  label: string;
  description: string | JSX.Element;
  defaultValue: string;
  onClick: (value: string) => Promise<any>;
  // optionals
  buttonLabel?: string;
  fieldName?: string;
  fieldLabel?: string;
  fieldType?: string;
  errorMessage?: string;
  onError?: (error: any) => void;
  onSuccess?: () => void;
  saveButtonLabel?: string;
};

const getTexts = (props: Props) => ({
  buttonLabel: props.buttonLabel || __('New'),
  fieldName: props.fieldName || __('name'),
  fieldLabel: props.fieldLabel || __('Name'),
  fieldType: props.fieldType || __('text'),
  errorMessage: props.errorMessage || __('Some error.'),
  saveButtonLabel: props.saveButtonLabel || __('Save'),
});

export const AddNew: React.FC<Props> = (props) => {
  const { defaultValue, label, description, disabled } = props;
  const {
    buttonLabel,
    fieldName,
    fieldLabel,
    fieldType,
    errorMessage,
    saveButtonLabel,
  } = getTexts(props);

  const [text, setText] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<
    false | 'working' | 'success' | 'failure'
  >(false);

  const {
    onClick,
    onSuccess,
    onError,
  } = props;

  const buttonStyle: React.CSSProperties = {
    textAlign: 'right',
    margin: 0,
  };

  const isButtonsDisabled = status === 'working' || status === 'success';

  const handleClickOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback((event: any, reason: string) => {
    if (isButtonsDisabled && (reason === 'escapeKeyDown' || reason === 'backdropClick')) {
      return;
    }

    setOpen(false);
    // hide state change on hiding animation
    setTimeout(() => {
      setStatus(false);
      setText(defaultValue);
    }, 200);
  }, [defaultValue, isButtonsDisabled]);

  const saveHandler = useCallback<React.FormEventHandler>(async (e) => {
    e.preventDefault();
    setStatus('working');

    try {
      await onClick(text);
    } catch (err) {
      setStatus('failure');
      if (typeof onError === 'function') {
        onError(err);
      }
    }

    setStatus('success');
    handleClose(null, 'save');
    if (typeof onSuccess === 'function') {
      onSuccess();
    }
  }, [handleClose, onClick, onSuccess, onError, text]);

  return (
    <div>
      <p style={buttonStyle}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClickOpen}
          disabled={disabled}
        >
          <AddIcon /> {buttonLabel}
        </Button>
      </p>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{label}</DialogTitle>
        <form onSubmit={saveHandler}>
          <DialogContent>
            <DialogContentText>{description}</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              name={fieldName}
              label={fieldLabel}
              type={fieldType}
              value={text}
              onChange={(e) => {
                setStatus(false);
                setText(e.target.value);
              }}
              fullWidth
            />
            {status === 'failure' && (
              <DialogContentText>{errorMessage}</DialogContentText>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={(e) => handleClose(e, 'cancel')}
              color="primary"
              disabled={isButtonsDisabled}
            >
              {__('Cancel')}
            </Button>
            <Button
              disabled={isButtonsDisabled}
              color="primary"
              type="submit"
            >
              {status === 'working' && (
                <CircularProgress size={16} style={{ marginRight: 8 }} />
              )}
              {saveButtonLabel}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default AddNew;
