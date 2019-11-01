import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio
} from "@material-ui/core";

// libs
import { __, sprintf } from "@wordpress/i18n";

// API
import updateMember from "../../../api/members/update";

// Types
import { Member } from "../../../redux/actions/team-member";
import { AppState } from "../../../redux/store";
import AmazonCognitoIdentity from "amazon-cognito-identity-js";
import { connect } from "react-redux";

// Redux
import { createActions as createTeamMemberActions } from "../../../redux/actions/team-member";
import Redux from "redux";

type OwnProps = {
  currentMember: Member;
  open: boolean;
  toggle: (open: boolean) => void;
};
type StateProps = {
  session: AmazonCognitoIdentity.CognitoUserSession | undefined;
  teamId: string;
  teamName: string;
};
type DispatchProps = {
  updateMemberRoleState: (
    teamId: string,
    memberSub: string,
    role: Member["role"]
  ) => void;
};
type Props = OwnProps & StateProps & DispatchProps;

const ChangeRole = (props: Props) => {
  const { currentMember, open, toggle, updateMemberRoleState } = props;
  const [role, setRole] = React.useState<false | Member["role"]>(
    currentMember.role
  );
  const [status, setStatus] = React.useState<
    false | "requesting" | "success" | "failure"
  >(false);

  React.useEffect(() => {
    setRole(currentMember.role);
  }, [currentMember]);

  const onSaveClick = () => {
    if (role) {
      setStatus("requesting");
      updateMember(props.session, props.teamId, currentMember.userSub, role)
        .then(() => {
          setStatus("success");
          updateMemberRoleState(props.teamId, currentMember.userSub, role);
          toggle(false);
        })
        .catch(() => {
          // TODO: show error
          setStatus("failure");
        });
    }
  };

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
                {__("Can access all resource in the team.")}
              </DialogContentText>

              <FormControlLabel
                value="Deactivated"
                control={<Radio />}
                label="Deactivated"
              />
              <DialogContentText>
                {__("Can not access all resouces in the team.")}
              </DialogContentText>
            </RadioGroup>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => toggle(false)} color="primary">
              {__("Cancel")}
            </Button>
            <Button color="primary" type="submit" onClick={onSaveClick}>
              {status === "requesting" && (
                <CircularProgress size={16} style={{ marginRight: 8 }} />
              )}
              {__("Save")}
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
};

const mapStateToProps = (state: AppState): StateProps => {
  const team = state.team.data[state.team.selectedIndex];
  return {
    session: state.authSupport.session,
    teamId: team.teamId,
    teamName: team.name
  };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch): DispatchProps => ({
  updateMemberRoleState: (teamId, userSub, role) =>
    dispatch(createTeamMemberActions.update(teamId, userSub, { role }))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangeRole);
