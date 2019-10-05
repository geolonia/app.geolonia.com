import React from "react";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import { __ } from "@wordpress/i18n";

import Save from "../custom/Save";
import defaultTeamIcon from "../custom/team.svg";
import Title from "../custom/Title";
import { AppState } from "../../redux/store";
import { connect } from "react-redux";
import { Team } from "../../redux/actions/team";
import Redux from "redux";
import { createActions as createTeamActions } from "../../redux/actions/team";
import updateTeam from "../../api/teams/update";
import AmazonCognitoIdentity from "amazon-cognito-identity-js";

type OwnProps = {};
type StateProps = {
  session?: AmazonCognitoIdentity.CognitoUserSession;
  selectedIndex: number;
  team: Team;
};
type DispatchProps = {
  updateTeamState: (index: number, team: Partial<Team>) => void;
};
type Props = OwnProps & StateProps & DispatchProps;

const styleDangerZone: React.CSSProperties = {
  border: "1px solid #ff0000",
  padding: "16px 24px"
};

const ProfileImageStyle: React.CSSProperties = {
  width: "250px",
  height: "auto",
  margin: "16px"
};

const breadcrumbItems = [
  {
    title: "Home",
    href: "#/"
  },
  {
    title: __("Team settings"),
    href: "#/team"
  },
  {
    title: __("General"),
    href: null
  }
];

const Content = (props: Props) => {
  const [draft, setDraft] = React.useState<Partial<Team>>({});
  const { session, team, selectedIndex, updateTeamState } = props;
  const { teamId, name, description, url, billingEmail } = team;

  // clear draft on Team change
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
    <div>
      <Title title={__("General")} breadcrumb={breadcrumbItems}>
        {__(
          "All users on the Geolonia service belong to one of the teams, and a team with the same name as the user is automatically generated when you sign up. You can switch teams in the pull-down menu at the top left of the sidebar."
        )}
      </Title>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
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
              (draft.description === void 0
                ? description
                : draft.description) || ""
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
              (draft.billingEmail === void 0
                ? billingEmail
                : draft.billingEmail) || ""
            }
            onChange={e => setDraft({ ...draft, billingEmail: e.target.value })}
          />
          <p className="mute">We’ll send receipts to this inbox.</p>

          <Save
            handler={onSaveClick}
            disabled={Object.keys(draft).length === 0}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography component="p" align="center">
            <img src={defaultTeamIcon} style={ProfileImageStyle} alt="" />
            <br />
            <Button variant="contained" color="default">
              {__("Upload new picture")}
            </Button>
          </Typography>
        </Grid>

        <Grid item xs={12} md={12}>
          <div style={styleDangerZone}>
            <Typography component="h3" color="secondary">
              {__("Danger Zone")}
            </Typography>
            <p>
              {__(
                "Once you delete a team, there is no going back. Please be certain. "
              )}
            </p>
            <Button variant="contained" color="secondary">
              {__("Delete")}
            </Button>
          </div>
        </Grid>
      </Grid>
    </div>
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
