import React from "react";

// Components
import AddNew from "../../custom/AddNew";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

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
  const [status, setStatus] = React.useState<
    false | "requesting" | "success" | "failure"
  >(false);

  const inviteHandler = (email: string) => {
    const { session, team, members } = props;

    if (members.find(member => member.email === email)) {
      setMessage(__("They is already a member of this team."));
      return Promise.reject("They are already a member of the team.");
    }

    if (team) {
      setStatus("requesting");
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
          setStatus("success");
          return res.json();
        } else if (res.status === 402) {
          setStatus("failure");
          setMessage(__("The maximum number of members has been reached."));
          throw new Error();
        } else {
          setStatus("failure");
          setMessage(__("You cannot use this email address for invitation."));
          throw new Error();
        }
      });
    } else {
      return Promise.reject("No team");
    }
  };

  return (
    <>
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
        onSuccess={() => {}}
        saveButtonLabel={__("Send")}
      />
      <Snackbar
        className={`snackbar-saved ${status}`}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        open={status === "success" || status === "failure"}
        autoHideDuration={6000}
        onClose={() => setStatus(false)}
        ContentProps={{
          "aria-describedby": "message-id"
        }}
        message={
          <span id="message-id">
            {status === "success"
              ? __("Successfully send invitation.")
              : status === "failure"
              ? __("Failed to send invitation.")
              : ""}
          </span>
        }
        action={[
          <IconButton
            key="close"
            aria-label="close"
            color="inherit"
            onClick={() => setStatus(false)}
          >
            <CloseIcon />
          </IconButton>
        ]}
      />
    </>
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
