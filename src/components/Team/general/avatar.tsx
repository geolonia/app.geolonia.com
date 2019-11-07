import React from "react";

// Components
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import defaultTeamIcon from "../../custom/team.svg";
import { CircularProgress } from "@material-ui/core";

// utils
import { __ } from "@wordpress/i18n";

// API
import putAvatar from "../../../api/teams/put-avatar";

// types
import { AppState, Team, Session } from "../../../types";

// redux
import Redux from "redux";
import { createActions as createTeamActions } from "../../../redux/actions/team";
import { connect } from "react-redux";

type OwnProps = {};
type StateProps = {
  session: Session;
  team: Team;
  index: number;
};
type DispatchProps = {
  setAvatar: (index: number, blobUrl: string | void) => void;
};
type Props = OwnProps & StateProps & DispatchProps;

const ProfileImageStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "250px",
  height: "auto",
  margin: "16px"
};

const Content = (props: Props) => {
  // states
  const [status, setStatus] = React.useState<
    false | "requesting" | "success" | "failure"
  >(false);

  // props
  const { team } = props;

  // refs
  const refContainer = React.useRef<HTMLInputElement | null>(null);

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const avatarUrl = URL.createObjectURL(file);
      const prevAvatarUrl = team.avatarImage;
      setStatus("requesting");

      putAvatar(props.session, team.teamId, file)
        .then(() => {
          props.setAvatar(props.index, avatarUrl);
          setStatus("success");
        })
        .catch(err => {
          props.setAvatar(props.index, prevAvatarUrl); // roleback
          setStatus("failure");
        });
    }
  };

  const onUploadClick = () => {
    if (refContainer.current) {
      refContainer.current.click();
    }
  };

  const isUploadEnabled = !!props.team.links.putAvatar;

  return (
    <>
      <Typography component="p" align="center">
        <img
          src={props.team.avatarImage || defaultTeamIcon}
          style={{
            ...ProfileImageStyle,
            opacity: status === "requesting" ? 0.6 : 1
          }}
          alt=""
        />
        <br />
        <Button
          variant="contained"
          color="default"
          onClick={onUploadClick}
          disabled={!isUploadEnabled}
        >
          {status === "requesting" && (
            <CircularProgress size={16} style={{ marginRight: 8 }} />
          )}
          {__("Upload new picture")}
        </Button>
        <input
          ref={refContainer}
          accept="image/*"
          style={{ display: "none" }}
          id="avatar-file"
          type="file"
          onChange={onFileSelected}
        />
      </Typography>
    </>
  );
};

const mapStateToProps = (state: AppState): StateProps => ({
  session: state.authSupport.session,
  team: state.team.data[state.team.selectedIndex],
  index: state.team.selectedIndex
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): DispatchProps => ({
  setAvatar: (index, blobUrl) =>
    dispatch(createTeamActions.setAvatar(index, blobUrl))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Content);
