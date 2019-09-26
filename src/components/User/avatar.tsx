import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import PersonIcon from "@material-ui/icons/Person";
import Avatar from "@material-ui/core/Avatar";
import updateAvatar from "../../api/users/avatar/update";
import { connect } from "react-redux";
import AmazonCognitoIdentity from "amazon-cognito-identity-js";

type OwnProps = {};
type StateProps = {
  session: AmazonCognitoIdentity.CognitoUserSession;
};
type Props = OwnProps & StateProps;
type State = {
  avatarUrl?: string;
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
      avatarUrl: void 0,
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
      this.setState({ avatarUrl, status: "requesting" });

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Image = reader.result;
        if (!base64Image || typeof base64Image !== "string") {
          return;
        }
        const { session } = this.props;
        updateAvatar(session, base64Image)
          .then((avatarUrl: string) => {
            console.log(avatarUrl);
            fetch(avatarUrl)
              .then(res => res.json())
              .then(data =>
                this.setState({
                  avatarUrl: data.base64Image,
                  status: "success"
                })
              );
          })
          .catch((err: any) => {
            console.error(err);
            this.setState({ status: "failure" });
          });
      };
      reader.onerror = err => {
        console.error(err);
        this.setState({ status: "failure" });
      };
    }
  };

  render() {
    const { avatarUrl } = this.state;

    return (
      <Typography component="p" align="center">
        {avatarUrl ? (
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
          Upload new picture
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

const mapStateToProps = (state: any) => ({
  session: state.authSupport.session
});

export default connect(mapStateToProps)(AvatarSection);
