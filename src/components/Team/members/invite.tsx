import React from "react";

// Component
import AddNew from "../../custom/AddNew";

// Util
import { __ } from "@wordpress/i18n";

// API
import addMember from "../../../api/members/add";

// Types
import AmazonCognitoIdentity from "amazon-cognito-identity-js";
import { Team } from "../../../redux/actions/team";
import { Member } from "../../../redux/actions/team-member";
import Redux from "redux";
import { AppState } from "../../../redux/store";

// redux
import { createActions as createTeamMemberActions } from "../../../redux/actions/team-member";
import { connect } from "react-redux";

type OwnProps = {};

type StateProps = {
  session?: AmazonCognitoIdentity.CognitoUserSession;
  members: Member[];
  team: Team | void;
};
type DispatchProps = {
  addMemberState: (teamId: string, member: Member) => void;
};
type Props = OwnProps & StateProps & DispatchProps;

export const Invite = (props: Props) => {
  const inviteHandler = (email: string) => {
    const { session, team, addMemberState, members } = props;
    if (team) {
      return addMember(session, team.teamId, email).then(newMember => {
        if (members.find(member => member.userSub === newMember.userSub)) {
          console.warn("Already joined");
          // TODO: Raise error and show message inside Add New component.
          // Related issue: https://github.com/geolonia/app.geolonia.com/issues/106
        } else {
          addMemberState(team.teamId, newMember);
        }
      });
    } else {
      return Promise.resolve();
    }
  };

  return (
    <AddNew
      buttonLabel={__("Invite")}
      label={__("Invite a member")}
      description={__(
        "We automatically update your billing as you add and remove team members."
      )}
      default=""
      fieldName="email"
      fieldLabel={__("Email")}
      fieldType="email"
      handler={inviteHandler}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Invite);
