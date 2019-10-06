import React from "react";

// Components
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import defaultTeamIcon from "../../custom/team.svg";

// utils
import { __ } from "@wordpress/i18n";

// types
import AmazonCognitoIdentity from "amazon-cognito-identity-js";

type OwnProps = {};
type StateProps = {
  session?: AmazonCognitoIdentity.CognitoUserSession;
};

type Props = OwnProps & StateProps;

const ProfileImageStyle: React.CSSProperties = {
  width: "250px",
  height: "auto",
  margin: "16px"
};

const Content = (props: Props) => {
  // state
  const [avatarUrl, setAvatarUrl] = React.useState<string | void>();

  const refContainer = React.useRef<HTMLInputElement | null>(null);

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const nextAvatarUrl = URL.createObjectURL(file);
      setAvatarUrl(nextAvatarUrl);

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Image = reader.result;
        if (!base64Image || typeof base64Image !== "string") {
          return;
        }
        console.log(base64Image);
      };
      reader.onerror = err => {
        console.error(err);
      };
    }
  };

  const onUploadClick = () => {
    if (refContainer.current) {
      refContainer.current.click();
    }
  };

  return (
    <>
      <Typography component="p" align="center">
        <img
          src={avatarUrl || defaultTeamIcon}
          style={ProfileImageStyle}
          alt=""
        />
        <br />
        <Button variant="contained" color="default" onClick={onUploadClick}>
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

export default Content;
