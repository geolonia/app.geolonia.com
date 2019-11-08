import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { CircularProgress, Box } from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";

// libs
import { __ } from "@wordpress/i18n";

// API
import updateMember from "../../../api/members/update";

// Types
import { AppState, Member, Session, Role, Roles } from "../../../types";
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
  session: Session;
  teamId: string;
  teamName: string;
};
type DispatchProps = {
  updateMemberRoleState: (
    teamId: string,
    memberSub: string,
    role: Role
  ) => void;
};
type Props = OwnProps & StateProps & DispatchProps;

const Suspend = (props: Props) => {
  const { currentMember, open, toggle, updateMemberRoleState } = props;
  const [role, setRole] = React.useState<false | Role>(currentMember.role);
  const [status, setStatus] = React.useState<
    false | "requesting" | "success" | "failure"
  >(false);
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    setRole(currentMember.role);
  }, [currentMember]);

  const onSaveClick = () => {
    if (role) {
      setStatus("requesting");
      updateMember(
        props.session,
        props.teamId,
        currentMember.userSub,
        Roles.Suspended
      ).then(result => {
        if (result.error) {
          setStatus("failure");
          setMessage(result.message);
        } else {
          setStatus("success");
          updateMemberRoleState(
            props.teamId,
            currentMember.userSub,
            Roles.Suspended
          );
          toggle(false);
        }
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
          <DialogTitle id="form-dialog-title">
            {__("Suspend team members")}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {__("The following members will be suspended:")}
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
            <Button color="primary" type="submit" onClick={onSaveClick}>
              {status === "requesting" && (
                <CircularProgress size={16} style={{ marginRight: 8 }} />
              )}
              {__("Save")}
            </Button>
          </DialogActions>

          {status === "failure" && (
            <DialogContent>
              <DialogContentText color={"secondary"}>
                {message}
              </DialogContentText>
            </DialogContent>
          )}
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
)(Suspend);
