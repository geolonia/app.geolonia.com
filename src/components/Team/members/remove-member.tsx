import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { CircularProgress, Box } from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import { __, sprintf } from "@wordpress/i18n";

// Types
import { Member } from "../../../redux/actions/team-member";

type Props = {
  currentMember: Member;
  teamName: string;
  open: boolean;
  toggle: (open: boolean) => void;
};

const RemoveMember = (props: Props) => {
  const { currentMember, teamName, open, toggle } = props;

  return (
    <div>
      <form>
        <Dialog
          open={open}
          onClose={() => toggle(false)}
          fullWidth={true}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            {sprintf("Removing 1 member from %s.", teamName)}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {__("The following members will be removed:")}
            </DialogContentText>

            <Box display="flex" alignItems="center">
              <PersonIcon />
              <p style={{ marginLeft: "1em" }}>
                {currentMember.name}
                <br />@{currentMember.username}
              </p>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => toggle(false)} color="primary">
              {__("Cancel")}
            </Button>
            <Button color="primary" type="submit">
              {__("Remove")}
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
};

export default RemoveMember;
