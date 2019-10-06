import React from "react";

// components
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import PersonIcon from "@material-ui/icons/Person";
import Avatar from "@material-ui/core/Avatar";

// redux
import { connect } from "react-redux";
import Redux from "redux";
import { createActions as createUserMetaActions } from "../../redux/actions/user-meta";

// utils
import { __ } from "@wordpress/i18n";

// types
import AmazonCognitoIdentity from "amazon-cognito-identity-js";
import { UserMetaState } from "../../redux/actions/user-meta";
import { AppState } from "../../redux/store";

type OwnProps = {};
type StateProps = {
  userMeta: UserMetaState;
};
type DispatchProps = {
  setAvatar: (avatarBlobUrl: string | void) => void;
};
type Props = OwnProps & StateProps & DispatchProps;
type State = {
  status: false | "requesting" | "success" | "failure";
  isFileAPISupported: boolean;
};

const ProfileImageStyle: React.CSSProperties = {
  width: "250px",
  height: "auto",
  fill: "#dedede",
  margin: "auto"
};

export class AvatarSection extends React.Component<Props, State> {
  private inputFileRef: HTMLInputElement | null;

  constructor(props: Props) {
    super(props);
    this.inputFileRef = null;
    this.state = {
      status: false,
      isFileAPISupported: true // TODO: check it
    };
  }

  onUploadClick = () => {
    if (this.inputFileRef) {
      this.inputFileRef.click();
    }
  };

  onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // TODO: check file type and size
      const file = e.target.files[0];
      const avatarUrl = URL.createObjectURL(file);
      const prevAvatarUrl = this.props.userMeta.avatarImage;
      this.props.setAvatar(avatarUrl);
      this.setState({ status: "requesting" });

      fetch(this.props.userMeta.links.putAvatar, {
        method: "PUT",
        headers: {
          "Content-Type": file.type
        },
        body: file
      })
        .then(() => {
          this.setState({ status: "success" });
        })
        .catch(err => {
          this.props.setAvatar(prevAvatarUrl); // roleback
          this.setState({ status: "failure" });
        });
    }
  };

  render() {
    const {
      userMeta: { avatarImage }
    } = this.props;

    return (
      <Typography component="div" align="center">
        {avatarImage ? (
          <Avatar src={avatarImage} style={ProfileImageStyle}></Avatar>
        ) : (
          <PersonIcon style={ProfileImageStyle} />
        )}
        <br />
        <Button
          variant="contained"
          color="default"
          onClick={this.onUploadClick}
        >
          {__("Upload new picture")}
        </Button>
        <input
          ref={ref => (this.inputFileRef = ref)}
          accept="image/*"
          style={{ display: "none" }}
          id="avatar-file"
          type="file"
          onChange={this.onFileSelected}
        />
      </Typography>
    );
  }
}

const mapStateToProps = (state: AppState): StateProps => ({
  userMeta: state.userMeta
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): DispatchProps => ({
  setAvatar: blobUrl => dispatch(createUserMetaActions.setAvatar(blobUrl))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AvatarSection);
