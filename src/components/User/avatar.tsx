import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import PersonIcon from "@material-ui/icons/Person";
import Avatar from "@material-ui/core/Avatar";
import { connect } from "react-redux";
import AmazonCognitoIdentity from "amazon-cognito-identity-js";
import { UserMetaState } from "../../redux/actions/user-meta";
import { AppState } from "../../redux/store";
import { __ } from "@wordpress/i18n";

type OwnProps = {};
type StateProps = {
  session?: AmazonCognitoIdentity.CognitoUserSession;
  userMeta: UserMetaState;
};
type Props = OwnProps & StateProps;
type State = {
  avatarUrl: string;
  status: false | "requesting" | "success" | "failure";
  isFileAPISupported: boolean;
  isAvatarReady: boolean;
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
      avatarUrl: props.userMeta.links.getAvatar,
      status: false,
      isFileAPISupported: true, // TODO: check it
      isAvatarReady: false
    };
  }

  componentDidMount() {
    // image fallback
    // TODO: can method HEAD be used?
    fetch(this.state.avatarUrl, { method: "GET" }).then(
      res => res.ok && this.setState({ isAvatarReady: true })
    );
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
      this.setState({ avatarUrl, status: "requesting" });

      fetch(this.props.userMeta.links.putAvatar, {
        method: "PUT",
        headers: {
          "Content-Type": file.type
        },
        body: file
      })
        .then(console.log)
        .catch(console.error);

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Image = reader.result;
        if (!base64Image || typeof base64Image !== "string") {
          return;
        }
        this.setState({
          avatarUrl: base64Image,
          status: "success"
        });
      };
      reader.onerror = err => {
        console.error(err);
        this.setState({ status: "failure" });
      };
    }
  };

  render() {
    const { avatarUrl, isAvatarReady } = this.state;

    return (
      <Typography component="div" align="center">
        {isAvatarReady ? (
          <Avatar src={avatarUrl} style={ProfileImageStyle}></Avatar>
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
  session: state.authSupport.session,
  userMeta: state.userMeta
});

export default connect(mapStateToProps)(AvatarSection);
