import React from "react";

// Components
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import {
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions
} from "@material-ui/core";
import { CircularProgress } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";

// utils
import { __, sprintf } from "@wordpress/i18n";
import Interweave from "interweave";

// api
import deleteTeam from "../../../api/teams/delete";

// types
import AmazonCognitoIdentity from "amazon-cognito-identity-js";
import { connect } from "react-redux";
import { AppState } from "../../../redux/store";
import { Team } from "../../../redux/actions/team";

// parameters
const styleDangerZone: React.CSSProperties = {
  border: "1px solid #ff0000",
  padding: "16px 24px"
};

type OwnProps = {};
type StateProps = {
  session?: AmazonCognitoIdentity.CognitoUserSession;
  team: Team;
};
type Props = OwnProps & StateProps;

const Content = (props: Props) => {
  // state
  const [open, setOpen] = React.useState(false);
  const [confirmation, setConfirmation] = React.useState("");
  const [status, setStatus] = React.useState<
    false | "requesting" | "success" | "failure"
  >(false);

  // props
  const { team } = props;

  const saveHandler = () => {
    if (confirmation.toUpperCase() === "DELETE") {
      const { session } = props;
      setStatus("requesting");
      deleteTeam(session, team.teamId)
        .then(() => {
          setConfirmation("");
          setStatus("success");
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        })
        .catch(() => {
          setConfirmation("");
          setStatus("failure");
          setTimeout(() => {
            setStatus(false);
            setOpen(false);
          }, 3000);
        });
    }
  };

  return (
    <div style={styleDangerZone}>
      <Typography component="h3" color="secondary">
        {__("Danger Zone")}
      </Typography>
      <p>
        {__(
          "Once you delete a team, there is no going back. Please be certain. "
        )}
      </p>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setOpen(true)}
      >
        {__("Delete")}
      </Button>

      <form>
        <Dialog
          open={open}
          // onClose={handleClose}
          fullWidth={true}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            <Typography component="span" color="secondary">
              {__("Confirm deletion")}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Interweave
                content={sprintf(
                  __(
                    "Please enter <code>delete</code> if you really want to delete the team <strong>%1$s</strong>."
                  ),
                  team.name
                )}
              />
            </DialogContentText>
            <TextField
              autoFocus
              error
              margin="normal"
              name="team-deletion-confirm"
              label={__("Confirm")}
              value={confirmation}
              onChange={e => setConfirmation(e.target.value)}
              disabled={status !== false}
              fullWidth
              placeholder="delete"
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setConfirmation("");
                setOpen(false);
              }}
              color="default"
              disabled={status !== false}
            >
              {__("Cancel")}
            </Button>
            <Button
              onClick={saveHandler}
              color="secondary"
              type="submit"
              disabled={
                confirmation.toUpperCase() !== "DELETE" || status !== false
              }
            >
              {status === "requesting" ? (
                <CircularProgress
                  size={16}
                  style={{ marginRight: 8 }}
                  color={"secondary"}
                />
              ) : status === "success" ? (
                <CheckIcon fontSize={"default"} color={"secondary"} />
              ) : null}
              {__("Delete")}
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
};

const mapStateToProps = (state: AppState): StateProps => {
  return {
    session: state.authSupport.session,
    team: state.team.data[state.team.selectedIndex]
  };
};

export default connect(mapStateToProps)(Content);
