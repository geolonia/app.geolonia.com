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
import { AppState, Session, Member, Team } from "../../../types";
import { connect } from "react-redux";

// Redux
import {
  createActions as createTeamMemberActions,
  Roles
} from "../../../redux/actions/team-member";
import Redux from "redux";
import Interweave from "interweave";

type OwnProps = {
  currentMember: Member;
  open: boolean;
  toggle: (open: boolean) => void;
};
type StateProps = {
  session: Session;
  team: Team;
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
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    setRole(currentMember.role);
  }, [currentMember]);

  const onSaveClick = () => {
    if (role) {
      setStatus("requesting");
      updateMember(
        props.session,
        props.team.teamId,
        currentMember.userSub,
        role
      ).then(result => {
        if (result.error) {
          setStatus("failure");
          setMessage(result.message);
        } else {
          setStatus("success");
          updateMemberRoleState(props.team.teamId, currentMember.userSub, role);
          toggle(false);
          window.location.reload();
        }
      });
    }
  };

  const isRoleChanged = role === currentMember.role;
  const isBillingMember =
    currentMember.role === Roles.Owner &&
    currentMember.email === props.team.billingEmail;

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
              {isBillingMember ? (
                <Interweave
                  content={sprintf(
                    __(
                      'The billing member %s cannot be degraded. Please modify the billing email at first on <a href="#/team/general">general team setting</a>.'
                    ),
                    currentMember.username
                  )}
                ></Interweave>
              ) : (
                sprintf(__("Select a new role of %s."), currentMember.username)
              )}
            </DialogContentText>

            <RadioGroup
              aria-label="role"
              name="role"
              value={role}
              onChange={e => setRole(e.target.value as Member["role"])}
            >
              <FormControlLabel
                value="Owner"
                control={<Radio disabled={isBillingMember} />}
                label={__("Owner")}
              />
              <DialogContentText>
                <ul>
                  <li>{__("can invite another team member.")}</li>
                  <li>{__("can designate another owner.")}</li>
                  <li>{__("can suspend another member.")}</li>
                  <li>
                    {__(
                      "Can manage all resources in the team, including API Keys."
                    )}
                  </li>
                </ul>
              </DialogContentText>

              <FormControlLabel
                value="Member"
                control={<Radio disabled={isBillingMember} />}
                label={__("Member")}
              />
              <DialogContentText>
                <ul>
                  <li>
                    {__(
                      "Can manage all resources in the team, including API Keys."
                    )}
                  </li>
                </ul>
              </DialogContentText>
            </RadioGroup>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => toggle(false)} color="primary">
              {__("Cancel")}
            </Button>
            <Button
              color="primary"
              type="submit"
              onClick={onSaveClick}
              disabled={isRoleChanged || isBillingMember}
            >
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
    team
  };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch): DispatchProps => ({
  updateMemberRoleState: (teamId, userSub, role) =>
    dispatch(createTeamMemberActions.update(teamId, userSub, { role }))
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangeRole);
