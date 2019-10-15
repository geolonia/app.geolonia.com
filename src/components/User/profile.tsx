import React from "react";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Save from "../custom/Save";
import { UserMetaState } from "../../redux/actions/user-meta";
import updateUserMeta from "../../api/users/update";
import { __ } from "@wordpress/i18n";
import momentTimeZone from "moment-timezone";
import reduxify, { ReduxifyProps } from "../../redux/reduxify";

type OwnProps = {};

type Props = OwnProps & ReduxifyProps;

type State = {
  userMeta: Pick<UserMetaState, "name" | "language" | "timezone">;
  email: string;
  username: string;
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
      userMeta: {
        name: props.user.name,
        language: props.user.language,
        timezone: props.user.timezone || momentTimeZone.tz.guess()
      },
      username: payload["cognito:username"] || "",
      email: payload.email || ""
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
  onTimezoneChange = (e: any) => this._setUserMeta("timezone", e.target.value);

  onSaveClick = (e: any) => {
    const { session, user } = this.props;
    const nextUserMeta = { ...user, ...this.state.userMeta };

    return updateUserMeta(session, nextUserMeta).then(() => {
      this.props.updateUser(nextUserMeta);
      // wait to show success effect
      setTimeout(() => {
        window.location.reload();
      }, 500);
    });
  };

  timezones = momentTimeZone.tz.names();

  render() {
    const { team, user } = this.props;

    const {
      userMeta: { name, language, timezone },
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
            value={timezone}
            onChange={this.onTimezoneChange}
          >
            {this.timezones.map((timezoneName: string) => (
              <MenuItem key={timezoneName} value={timezoneName}>
                {timezoneName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* TODO: show loading */}
        <Save onClick={this.onSaveClick} />
      </>
    );
  }
}

export default reduxify(Profile);
