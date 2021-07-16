import React, { useState, useEffect } from "react";

// Components
import TextField from "@material-ui/core/TextField";
import Save from "../../custom/Save";

// Redux
import Redux from "redux";
import { connect } from "react-redux";
import { createActions as createTeamActions } from "../../../redux/actions/team";

// API
import updateTeam from "../../../api/teams/update";

// utils
import { __ } from "@wordpress/i18n";
import { Roles } from "../../../constants";
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";

type OwnProps = Record<string, never>;
type StateProps = {
  session: Geolonia.Session;
  selectedIndex: number;
  team: Geolonia.Team;
  members: Geolonia.Member[];
};
type DispatchProps = {
  updateTeamState: (index: number, team: Partial<Geolonia.Team>) => void;
};
type Props = OwnProps & StateProps & DispatchProps;

const selectStyle: React.CSSProperties = {
  marginTop: "16px",
  marginBottom: "8px"
};

const Content = (props: Props) => {
  // props
  const { session, team, members, selectedIndex, updateTeamState } = props;
  const { teamId, name, description, url, billingEmail } = team;
  // state
  const [draft, setDraft] = useState<Partial<Geolonia.Team>>({});

  const onNameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const name = e.currentTarget.value;
    setDraft({ ...draft, name: name.trim() });
  };

  // effects
  //// clear draft on Team change
  useEffect(() => setDraft({}), [selectedIndex]);

  const onSaveClick = () => {
    // update server side
    return updateTeam(session, teamId, draft).then(result => {
      if (result.error) {
        throw new Error(result.code);
      } else {
        // update client side state
        updateTeamState(selectedIndex, draft);
        setDraft({});
      }
    });
  };

  const draftExists = Object.keys(draft).length !== 0;
  const isOwner = team.role === Roles.Owner;

  let saveDisabled = !draftExists || !isOwner;
  if (typeof draft.name === "string") {
    if (draft.name.trim() === "") {
      saveDisabled = true;
    }
  }

  const ownersEmail = members
    .filter(member => member.role === Roles.Owner)
    .map(member => member.email);

  return (
    <>
      <TextField
        id="team-name"
        label={__("Name")}
        margin="normal"
        fullWidth={true}
        value={(draft.name === void 0 ? name : draft.name) || ""}
        onChange={e => setDraft({ ...draft, name: e.target.value })}
        disabled={isOwner !== true}
        onBlur={onNameBlur}
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
        disabled={isOwner !== true}
      />
      <TextField
        id="team-url"
        label={__("URL")}
        margin="normal"
        fullWidth={true}
        value={(draft.url === void 0 ? url : draft.url) || ""}
        onChange={e => setDraft({ ...draft, url: e.target.value })}
        disabled={isOwner !== true}
      />

      <FormControl fullWidth={true} style={selectStyle}>
        <InputLabel htmlFor="billing-email">{__("Billing email")}</InputLabel>
        <Select
          id="billing-email"
          fullWidth={true}
          disabled={isOwner !== true}
          value={
            (draft.billingEmail === void 0 && ownersEmail.includes(billingEmail)
              ? billingEmail
              : draft.billingEmail) || ""
          }
          onChange={(e: any) =>
            setDraft({ ...draft, billingEmail: e.target.value })
          }
        >
          {ownersEmail.map(email => (
            <MenuItem value={email} key={email}>
              {email}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <p className="mute">{__("We'll send you an email receipt.")}</p>

      <Save onClick={onSaveClick} disabled={saveDisabled} />
    </>
  );
};

const mapStateToProps = (state: Geolonia.Redux.AppState) => {
  const selectedIndex = state.team.selectedIndex;
  const team = state.team.data[selectedIndex];
  const members = (state.teamMember[team.teamId] || { data: [] }).data;
  return {
    session: state.authSupport.session,
    selectedIndex,
    team,
    members
  };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch) => {
  return {
    updateTeamState: (index: number, team: Partial<Geolonia.Team>) =>
      dispatch(createTeamActions.update(index, team))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Content);
