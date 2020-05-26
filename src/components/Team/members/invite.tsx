import React from "react";

// Components
import AddNew from "../../custom/AddNew";

// Util
import { __ } from "@wordpress/i18n";
import fetch from "../../../lib/fetch";

// Types
import { AppState, Session, Team, Member } from "../../../types";

// redux
import { connect } from "react-redux";

type OwnProps = {
  disabled?: boolean;
};

type StateProps = {
  session: Session;
  members: Member[];
  team: Team | void;
};
type Props = OwnProps & StateProps;

export const Invite = (props: Props) => {
  const [message, setMessage] = React.useState("");

  const inviteHandler = (email: string) => {
    const { session, team, members } = props;

    if (members.find(member => member.email === email)) {
      setMessage(__("They is already a member of this team."));
      return Promise.reject("They are already a member of the team.");
    }

    if (team) {
      return fetch(
        session,
        `https://api.app.geolonia.com/${process.env.REACT_APP_STAGE}/teams/${team.teamId}/invitation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email })
        }
      ).then(res => {
        if (res.status < 400) {
          return res.json();
        } else {
          setMessage(__("Please set correct email address."));
          throw new Error();
        }
      });
    } else {
      return Promise.reject("No team");
    }
  };

  return (
    <AddNew
      disabled={props.disabled}
      buttonLabel={__("Invite")}
      label={__("Send an invitation")}
      description={__(
        "We automatically update your billing as your invitation is accepted."
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

export default connect(mapStateToProps)(Invite);
