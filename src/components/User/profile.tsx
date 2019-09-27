import React from "react";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Save from "../custom/Save";
import AmazonCognitoIdentity from "amazon-cognito-identity-js";
import { connect } from "react-redux";
import { AppState } from "../../redux/store";
import {
  UserMetaState,
  createActions as createUserMetaActions
} from "../../redux/actions/user-meta";
import updateUserMeta from "../../api/users/update";
import Redux from "redux";
import { __ } from "@wordpress/i18n";

type OwnProps = {};
type StateProps = {
  session?: AmazonCognitoIdentity.CognitoUserSession;
  userMeta: UserMetaState;
};
type DispatchProps = {
  setUserMetaState: (userMeta: UserMetaState) => void;
};
type Props = StateProps & OwnProps & DispatchProps;

type State = UserMetaState;

const selectStyle: React.CSSProperties = {
  marginTop: "16px",
  marginBottom: "8px"
};

export class Profile extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { ...props.userMeta };
  }

  onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ username: e.currentTarget.value });
  };

  onDispayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: e.currentTarget.value });
  };

  onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ email: e.currentTarget.value });
  };

  onLanguageChange = (e: any) => {
    this.setState({ language: e.target.value });
  };

  onSaveClick = (e: any) => {
    const { session } = this.props;
    session &&
      updateUserMeta(session, this.state).then(() => {
        this.props.setUserMetaState(this.state);
      });
  };

  render() {
    const { username, name, email, language } = this.state;

    return (
      <>
        <TextField
          id="username"
          label={__("Username")}
          margin="normal"
          value={username}
          onChange={this.onUsernameChange}
          fullWidth={true}
        />

        <TextField
          id="display-name"
          label={__("Name")}
          margin="normal"
          value={name}
          onChange={this.onDispayNameChange}
          fullWidth={true}
        />

        <TextField
          id="email"
          label={__("Email")}
          margin="normal"
          value={email}
          onChange={this.onEmailChange}
          fullWidth={true}
        />

        <FormControl fullWidth={true} style={selectStyle}>
          <InputLabel htmlFor="select-language">{__('Language')}</InputLabel>
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

        <Save handler={this.onSaveClick} />
      </>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  session: state.authSupport.session,
  userMeta: state.userMeta
});

const mapDispatchToProps = (dispatch: Redux.Dispatch) => ({
  setUserMetaState: (userMeta: UserMetaState) =>
    dispatch(createUserMetaActions.setUserMeta(userMeta))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
