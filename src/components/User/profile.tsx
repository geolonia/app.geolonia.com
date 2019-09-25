import React from "react";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Save from "../custom/Save";
import AmazonCognitoIdentity from "amazon-cognito-identity-js";
import getUserMeta from "../../api/users/get";
import { connect } from "react-redux";
import { AppState } from "../../redux/store";

type State = {
  username: string;
  displayName: string;
  email: string;
  language: string;
};

type OwnProps = {};
type StateProps = { session?: AmazonCognitoIdentity.CognitoUserSession };
type Props = StateProps & OwnProps;

const selectStyle: React.CSSProperties = {
  marginTop: "16px",
  marginBottom: "8px"
};

export class Profile extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      username: "",
      displayName: "",
      email: "",
      language: "en"
    };
  }

  componentDidMount() {
    const { session } = this.props;
    // session should not be null when this component mount
    session && getUserMeta(session).then(userMeta => console.log(userMeta));
  }

  onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ username: e.currentTarget.value });
  };

  onDispayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ displayName: e.currentTarget.value });
  };

  onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ email: e.currentTarget.value });
  };

  onLanguageChange = (e: any) => {
    this.setState({ language: e.target.value });
  };

  render() {
    const { username, displayName, email, language } = this.state;

    return (
      <>
        <TextField
          id="username"
          label="Username"
          margin="normal"
          value={username}
          onChange={this.onUsernameChange}
          fullWidth={true}
        />

        <TextField
          id="display-name"
          label="Name"
          margin="normal"
          value={displayName}
          onChange={this.onDispayNameChange}
          fullWidth={true}
        />

        <TextField
          id="email"
          label="Email"
          margin="normal"
          value={email}
          onChange={this.onEmailChange}
          fullWidth={true}
        />

        <FormControl fullWidth={true} style={selectStyle}>
          <InputLabel htmlFor="select-language">Language</InputLabel>
          <Select
            id="select-language"
            fullWidth={true}
            value={language}
            onChange={this.onLanguageChange}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="ja">日本語</MenuItem>
          </Select>
        </FormControl>

        <Save />
      </>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  session: state.authSupport.session
});

export default connect(mapStateToProps)(Profile);
