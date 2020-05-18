import React from "react";

// Components
import AddNew from "../../custom/AddNew";

// Util
import { __ } from "@wordpress/i18n";

// API
import addMember from "../../../api/members/add";

// Types
import { AppState, Session, Team, Member } from "../../../types";

// redux
import Redux from "redux";
import { createActions as createTeamMemberActions } from "../../../redux/actions/team-member";
import { connect } from "react-redux";

type OwnProps = {
  disabled?: boolean;
};

type StateProps = {
  session: Session;
  members: Member[];
  team: Team | void;
};
type DispatchProps = {
  addMemberState: (teamId: string, member: Member) => void;
};
type Props = OwnProps & StateProps & DispatchProps;

export const Invite = (props: Props) => {
  const [message, setMessage] = React.useState("");

  const inviteHandler = (email: string) => {
    const { session, team, addMemberState, members } = props;

    if (members.find(member => member.email === email)) {
      setMessage(__("They are already a member of the team."));
      return Promise.reject("They are already a member of the team.");
    }

    if (team) {
      return addMember(session, team.teamId, email).then(result => {
        if (result.error) {
          setMessage(result.message);
          throw new Error(result.code);
        } else {
          const newMember = result.data;
          if (members.find(member => member.userSub === newMember.userSub)) {
            console.warn("Already joined");
          } else {
            addMemberState(team.teamId, newMember);
          }
        }
      });
    } else {
      return Promise.reject("Unknown Error");
    }
  };

  return (
    <AddNew
      disabled={props.disabled}
      buttonLabel={__("Invite")}
      label={__("Invite a member")}
      description={__(
        "We automatically update your billing as you add and remove team members."
      )}
      defaultValue=""
      fieldName="email"
      fieldLabel={__("Email")}
      fieldType="email"
      errorMessage={message}
      onClick={inviteHandler}
      onError={() => {}}
    />
  );
};

export const mapStateToProps = (state: AppState): StateProps => {
  const { session } = state.authSupport;
  const selectedTeamIndex = state.team.selectedIndex;
  const team = state.team.data[selectedTeamIndex] as Team | void;
  let members: Member[] = [];
  if (team) {
    const memberObject = state.teamMember[team.teamId];
    if (memberObject) {
      members = memberObject.data;
    }
  }
  return { session, team, members };
};

export const mapDispatchToProps = (dispatch: Redux.Dispatch) => ({
  addMemberState: (teamId: string, member: Member) =>
    dispatch(createTeamMemberActions.add(teamId, member))
});

export default connect(mapStateToProps, mapDispatchToProps)(Invite);
