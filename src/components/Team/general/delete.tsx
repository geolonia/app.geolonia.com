import React from "react";

// Components
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import {
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions
} from "@material-ui/core";

// utils
import { __ } from "@wordpress/i18n";

// parameters
const styleDangerZone: React.CSSProperties = {
  border: "1px solid #ff0000",
  padding: "16px 24px"
};

const Content = () => {
  // state
  const [open, setOpen] = React.useState(false);
  const [confirmation, setConfirmation] = React.useState("");

  const saveHandler = () => {
    if (confirmation.toUpperCase() === "DELETE") {
      setOpen(false);
    }
  };

  return (
    <div style={styleDangerZone}>
      <Typography component="h3" color="secondary">
        {__("Danger Zone")}
      </Typography>
      <p>
        {__(
          "Once you delete a team, there is no going back. Please be certain. "
        )}
      </p>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setOpen(true)}
      >
        {__("Delete")}
      </Button>

      <form>
        <Dialog
          open={open}
          // onClose={handleClose}
          fullWidth={true}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            {__("Confirm deletion")}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {__("Please enter delete if you really want to delete the team.")}
            </DialogContentText>
            <TextField
              autoFocus
              margin="normal"
              name="team-deletion-confirm"
              label={__("Confirm")}
              value={confirmation}
              onChange={e => setConfirmation(e.target.value)}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="primary">
              {__("Cancel")}
            </Button>
            <Button
              onClick={saveHandler}
              color="primary"
              type="submit"
              disabled={confirmation.toUpperCase() !== "DELETE"}
            >
              {__("Delete")}
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
};

export default Content;
