import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import PersonIcon from "@material-ui/icons/Person";
import Avatar from "@material-ui/core/Avatar";

type Props = {};
type State = {
  avatarUrl?: string;
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
      const file = e.target.files[0];
      const avatarUrl = URL.createObjectURL(file);
      this.setState({ avatarUrl });
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

export default AvatarSection;
