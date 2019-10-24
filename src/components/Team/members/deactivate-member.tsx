import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { CircularProgress, Box, Chip } from "@material-ui/core";
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
  updateMemberState: (
    teamId: string,
    memberSub: string,
    deactivated: boolean
  ) => void;
};
type Props = OwnProps & StateProps & DispatchProps;

const DeactivateMember = (props: Props) => {
  const { currentMember, teamName, open, toggle, updateMemberState } = props;
  const [status, setStatus] = React.useState<
    false | "requesting" | "success" | "failure"
  >(false);

  const onDeactivateClick = () => {
    setStatus("requesting");
    updateMember(props.session, props.teamId, currentMember.userSub, {
      deactivated: !currentMember.deactivated
    })
      .then(() => {
        setStatus("success");
        updateMemberState(
          props.teamId,
          currentMember.userSub,
          !currentMember.deactivated
        );
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
            {currentMember.deactivated
              ? sprintf("Activating 1 member from %s.", teamName)
              : sprintf("Deactivating 1 member from %s.", teamName)}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {currentMember.deactivated
                ? __("The following members will be activated:")
                : __("The following members will be deactivated:")}
            </DialogContentText>

            <Box display="flex" alignItems="center">
              <PersonIcon />
              <p style={{ marginLeft: "1em" }}>
                {currentMember.name}
                <br />@{currentMember.username}
              </p>
              <p style={{ marginLeft: "1em" }}>
                {currentMember.deactivated && (
                  <Chip label={__("Deactivated")} color={"secondary"} />
                )}
              </p>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => toggle(false)} color="primary">
              {__("Cancel")}
            </Button>
            <Button color="primary" type="submit" onClick={onDeactivateClick}>
              {status === "requesting" && (
                <CircularProgress size={16} style={{ marginRight: 8 }} />
              )}
              {currentMember.deactivated ? __("Activate") : __("Deactivate")}
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
  updateMemberState: (teamId, userSub, deactivated) =>
    dispatch(createTeamMemberActions.update(teamId, userSub, { deactivated }))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeactivateMember);
