import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { RadioGroup, FormControlLabel, Radio } from "@material-ui/core";
import { __, sprintf } from "@wordpress/i18n";

// Types
import { Member } from "../../../redux/actions/team-member";

type Props = {
  currentMember: Member;
  teamName: string;
  open: boolean;
  toggle: (open: boolean) => void;
};

const ChangeRole = (props: Props) => {
  const { currentMember, open, toggle } = props;
  const [role, setRole] = React.useState<false | Member["role"]>(
    currentMember.role
  );

  React.useEffect(() => {
    setRole(currentMember.role);
  }, [currentMember]);

  return (
    <div>
      <form>
        <Dialog
          open={open}
          onClose={() => toggle(false)}
          fullWidth={true}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">{__("Change role")}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {sprintf("Select a new role of %s.", currentMember.username)}
            </DialogContentText>

            <RadioGroup
              aria-label="role"
              name="role"
              value={role}
              onChange={e => setRole(e.target.value as (Member["role"]))}
            >
              <FormControlLabel
                value="Owner"
                control={<Radio />}
                label="Owner"
              />
              <DialogContentText>
                {__("Has full administrative access to the entire team.")}
              </DialogContentText>

              <FormControlLabel
                value="Member"
                control={<Radio />}
                label="Member"
              />
              <DialogContentText>
                {__("Can access every resource in the team.")}
              </DialogContentText>
            </RadioGroup>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => toggle(false)} color="primary">
              {__("Cancel")}
            </Button>
            <Button color="primary" type="submit">
              {__("Save")}
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
};

export default ChangeRole;
