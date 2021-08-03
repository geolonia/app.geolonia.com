import React, { useState, useContext } from "react";

import { context as NotificationContext} from '../../contexts/notification'

// Components
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import CheckIcon from "@material-ui/icons/Check";
import { CircularProgress } from "@material-ui/core";
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
  const { updateState: updateNotificationState } = useContext(NotificationContext)

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
          try {
            await onClick()
            updateNotificationState({ open: true, message: successMessage, type: 'success' })
            setStatus(false)
          } catch (error) {
            updateNotificationState({ open: true, message: errorMessage, type: 'failure' })
            setStatus('failure')
          }
        }}
        disabled={disabled || status === 'working'}
      >
        {status === "working" ? (
          <CircularProgress size={16} style={{ marginRight: 8, color: 'inherit' }} />
        ) :
          status === 'success' ? <CheckIcon /> : <AddIcon />}
         {buttonLabel}
      </Button>
    </p>
  );
};

export default AddNew;
