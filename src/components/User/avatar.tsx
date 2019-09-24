import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import PersonIcon from "@material-ui/icons/Person";

type Props = {};
type State = {
  avatarUrl?: string;
};

const ProfileImageStyle: React.CSSProperties = {
  width: "250px",
  height: "auto",
  fill: "#dedede"
};

export class Avatar extends React.Component<Props, State> {
  state = {
    avatarUrl: void 0
  };

  render() {
    const { avatarUrl } = this.state;

    return (
      <Typography component="p" align="center">
        <PersonIcon style={ProfileImageStyle} />
        <br />
        <label htmlFor="avatar-file">
          <Button variant="contained" color="default">
            Upload new picture
          </Button>
        </label>
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="avatar-file"
          type="file"
          value={avatarUrl}
        />
      </Typography>
    );
  }
}

export default Avatar;
