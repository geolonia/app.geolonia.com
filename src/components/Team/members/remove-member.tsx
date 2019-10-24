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
import { connect } from "react-redux";

// Redux
import { createActions as createTeamMemberActions } from "../../../redux/actions/team-member";
import Redux from "redux";

type OwnProps = {
  currentMember: Member;
  teamName: string;
  open: boolean;
  toggle: (open: boolean) => void;
};
type StateProps = {
  session: AmazonCognitoIdentity.CognitoUserSession | undefined;
  teamId: string;
};
type DispatchProps = {
  deleteMemberState: (teamId: string, memberSub: string) => void;
};
type Props = OwnProps & StateProps & DispatchProps;

const RemoveMember = (props: Props) => {
  const { currentMember, teamName, open, toggle, deleteMemberState } = props;
  const [status, setStatus] = React.useState<
    false | "requesting" | "success" | "failure"
  >(false);

  const onRemoveClick = () => {
    setStatus("requesting");
    updateMember(props.session, props.teamId, currentMember.userSub, {
      role: "Fired"
    })
      .then(() => {
        setStatus("success");
        deleteMemberState(props.teamId, currentMember.userSub);
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
            <Button color="primary" type="submit" onClick={onRemoveClick}>
              {status === "requesting" && (
                <CircularProgress size={16} style={{ marginRight: 8 }} />
              )}
              {__("Remove")}
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
};

const mapStateToProps = (state: AppState): StateProps => ({
  session: state.authSupport.session,
  teamId: state.team.data[state.team.selectedIndex].teamId
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): DispatchProps => ({
  deleteMemberState: (teamId, userSub) =>
    dispatch(createTeamMemberActions.delete(teamId, userSub))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RemoveMember);
