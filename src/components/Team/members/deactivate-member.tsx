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
import { __, sprintf } from "@wordpress/i18n";

// API
import updateMember from "../../../api/members/update";

// Types
import { Member } from "../../../redux/actions/team-member";
import { AppState } from "../../../redux/store";
import AmazonCognitoIdentity from "amazon-cognito-identity-js";

// Redux
import { connect } from "react-redux";
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
  deactivateMemberState: (teamId: string, memberSub: string) => void;
};
type Props = OwnProps & StateProps & DispatchProps;

const DeactivateMember = (props: Props) => {
  const {
    currentMember,
    teamName,
    open,
    toggle,
    deactivateMemberState
  } = props;
  const [status, setStatus] = React.useState<
    false | "requesting" | "success" | "failure"
  >(false);

  const onDeactivateClick = () => {
    setStatus("requesting");
    updateMember(props.session, props.teamId, currentMember.userSub, {
      deactivated: true
    })
      .then(() => {
        setStatus("success");
        deactivateMemberState(props.teamId, currentMember.userSub);
        toggle(false);
      })
      .catch(() => {
        setStatus("failure");
      });
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
            {sprintf("Deactivating 1 member from %s.", teamName)}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {__("The following members will be deactivate:")}
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
              {status === "requesting" && (
                <CircularProgress size={16} style={{ marginRight: 8 }} />
              )}
              {__("Deactivate")}
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
  deactivateMemberState: (teamId, userSub) =>
    dispatch(
      createTeamMemberActions.update(teamId, userSub, { deactivated: true })
    )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeactivateMember);
