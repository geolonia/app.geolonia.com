import React, { useContext } from 'react'
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { context as NotificationContext } from '../contexts/notification'

export const CommonNotification: React.FC<{}> = () => {
  const { state: { open, message, type }, updateState } = useContext(NotificationContext)

  return <Snackbar
    className={'snackbar-saved success'}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "left"
    }}
    open={open}
    autoHideDuration={6000}
    onClose={() => updateState({ open: false, message, type })}
    ContentProps={{ "aria-describedby": "common-message"}}
    message={<span id="common-message">{message}</span>}
    action={[
      <IconButton
        key="close"
        aria-label="close"
        color="inherit"
        onClick={() => { updateState({ open: false, message, type }) }}
      >
        <CloseIcon />
      </IconButton>
    ]}
  />
}

export default CommonNotification
