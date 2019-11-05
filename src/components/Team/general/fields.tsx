import React from "react";

// Components
import TextField from "@material-ui/core/TextField";
import Save from "../../custom/Save";

// Redux
import Redux from "redux";
import { connect } from "react-redux";
import { createActions as createTeamActions } from "../../../redux/actions/team";

// API
import updateTeam from "../../../api/teams/update";

// types
import { AppState, Session, Team } from "../../../types";

// utils
import { __ } from "@wordpress/i18n";

type OwnProps = {};
type StateProps = {
  session: Session;
  selectedIndex: number;
  team: Team;
};
type DispatchProps = {
  updateTeamState: (index: number, team: Partial<Team>) => void;
};
type Props = OwnProps & StateProps & DispatchProps;

const Content = (props: Props) => {
  // props
  const { session, team, selectedIndex, updateTeamState } = props;
  const { teamId, name, description, url, billingEmail } = team;

  // state
  const [draft, setDraft] = React.useState<Partial<Team>>({});

  // effects
  //// clear draft on Team change
  React.useEffect(() => setDraft({}), [selectedIndex]);

  const onSaveClick = () => {
    // update server side
    return updateTeam(session, teamId, draft).then(result => {
      console.log({ result });
      // update client side state
      updateTeamState(selectedIndex, draft);
      setDraft({});
    });
  };

  return (
    <>
      <TextField
        id="team-name"
        label={__("Name")}
        margin="normal"
        fullWidth={true}
        value={(draft.name === void 0 ? name : draft.name) || ""}
        onChange={e => setDraft({ ...draft, name: e.target.value })}
      />
      <TextField
        id="team-description"
        label={__("Description")}
        margin="normal"
        multiline={true}
        rows={5}
        fullWidth={true}
        value={
          (draft.description === void 0 ? description : draft.description) || ""
        }
        onChange={e => setDraft({ ...draft, description: e.target.value })}
      />
      <TextField
        id="team-url"
        label={__("URL")}
        margin="normal"
        fullWidth={true}
        value={(draft.url === void 0 ? url : draft.url) || ""}
        onChange={e => setDraft({ ...draft, url: e.target.value })}
      />
      <TextField
        id="team-billing-email"
        label={__("Billing email")}
        margin="normal"
        fullWidth={true}
        value={
          (draft.billingEmail === void 0 ? billingEmail : draft.billingEmail) ||
          ""
        }
        onChange={e => setDraft({ ...draft, billingEmail: e.target.value })}
      />
      <p className="mute">We’ll send receipts to this inbox.</p>

      <Save onClick={onSaveClick} disabled={Object.keys(draft).length === 0} />
    </>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    session: state.authSupport.session,
    selectedIndex: state.team.selectedIndex,
    team: state.team.data[state.team.selectedIndex]
  };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch) => {
  return {
    updateTeamState: (index: number, team: Partial<Team>) =>
      dispatch(createTeamActions.update(index, team))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Content);
