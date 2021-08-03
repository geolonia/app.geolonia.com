import React, { useCallback, useState } from "react";

// Components
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import CheckIcon from "@material-ui/icons/Check";
import { CircularProgress } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
// Utils
import { __ } from "@wordpress/i18n";

type Props = {
  disabled?: boolean;
  onClick: () => Promise<any>;
  buttonLabel: string;
  successMessage: string;
  errorMessage: string;
};

/**
 * Simplified <AddNew /> without yes/no dialog
 * @param props
 * @returns
 */
export const AddNew: React.FC<Props> = (props) => {
  const { disabled, onClick, buttonLabel, successMessage, errorMessage } = props;

  const [status, setStatus] = useState<
    false | "working" | "success" | "failure"
  >(false);

  const buttonStyle: React.CSSProperties = {
    textAlign: "right",
    margin: 0
  };

  return (
    <p style={buttonStyle}>
      <Button
        variant="contained"
        color="primary"
        onClick={async () => {
          setStatus('working')
          await onClick()
          setStatus('success')
          setTimeout(() => setStatus(false), 3000)
        }}
        disabled={disabled || status === 'working'}
      >
        {status === "working" ? (
          <CircularProgress size={16} style={{ marginRight: 8, color: 'inherit' }} />
        ) :
          status === 'success' ? <CheckIcon /> : <AddIcon />}
         {buttonLabel}
      </Button>
      <Snackbar
        className={`snackbar-saved ${status}`}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        open={status === 'success' || status === 'failure'}
        autoHideDuration={6000}
        onClose={() => setStatus(false)}
        ContentProps={{
          "aria-describedby": "message-id"
        }}
        message={
          <span id="message-id">
            {status === "success" ? successMessage : errorMessage}
          </span>
        }
        action={[
          <IconButton
            key="close"
            aria-label="close"
            color="inherit"
            onClick={() => setStatus(false)}
          >
            <CloseIcon />
          </IconButton>
        ]}
      />
    </p>
  );
};

export default AddNew;
