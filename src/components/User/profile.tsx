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
import momentTimeZone from 'moment-timezone';
import moment from "moment-timezone";

type OwnProps = {};
type MappedStateProps = {
  session?: AmazonCognitoIdentity.CognitoUserSession;
  userMeta: UserMetaState;
};
type DispatchProps = {
  setUserMetaState: (userMeta: UserMetaState) => void;
};
type Props = MappedStateProps & OwnProps & DispatchProps;

type State = {
  userMeta: UserMetaState;
  email: string;
  username: string;
  status: false | "requesting" | "success" | "failure";
};
const selectStyle: React.CSSProperties = {
  marginTop: "16px",
  marginBottom: "8px"
};

export class Profile extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { session } = this.props;
    const payload = session ? session.getIdToken().payload : {};
    this.state = {
      userMeta: { ...props.userMeta },
      username: payload["cognito:username"] || "",
      email: payload.email || "",
      status: false
    };
  }

  _setUserMeta = (key: keyof UserMetaState, value: string) => {
    this.setState({
      userMeta: { ...this.state.userMeta, [key]: value }
    });
  };

  onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this._setUserMeta("name", e.currentTarget.value);
  };

  onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ email: e.target.value });

  onLanguageChange = (e: any) => this._setUserMeta("language", e.target.value);

  onSaveClick = (e: any) => {
    const { session } = this.props;
    const nextUserMeta = this.state.userMeta;

    this.setState({ status: "requesting" });

    updateUserMeta(session, nextUserMeta)
      .then(() => {
        this.props.setUserMetaState(nextUserMeta);
        this.setState({ status: "success" });
      })
      .catch(err => {
        console.error(err);
        this.setState({ status: "failure" });
      });
  };

  timezones = momentTimeZone.tz.names()

  render() {
    const {
      userMeta: { name, language },
      email,
      username
    } = this.state;

    return (
      <>
        <TextField
          id="username"
          label={__("Username")}
          margin="normal"
          value={username}
          fullWidth={true}
          disabled
        />

        <TextField
          id="email"
          label={__("Email")}
          margin="normal"
          value={email}
          onChange={this.onEmailChange}
          fullWidth={true}
          // NOTE: currently disabled
          disabled
        />
        {/* <Save></Save> */}

        <TextField
          id="display-name"
          label={__("Name")}
          margin="normal"
          value={name}
          onChange={this.onNameChange}
          fullWidth={true}
        />

        <FormControl fullWidth={true} style={selectStyle}>
          <InputLabel htmlFor="select-language">{__("Language")}</InputLabel>
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

        <FormControl fullWidth={true} style={selectStyle}>
          <InputLabel htmlFor="select-timezone">{__("Time zone")}</InputLabel>
          <Select
            id="select-timezone"
            fullWidth={true}
            value={language}
            onChange={this.onLanguageChange}
          >
          {this.timezones.map((timezoneName: string) => (
            <MenuItem value={timezoneName}>{timezoneName}</MenuItem>
          ))}
          </Select>
        </FormControl>

        {/* TODO: show loading */}
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
