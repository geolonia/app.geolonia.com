import React from 'react';

// components
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import PersonIcon from '@material-ui/icons/Person';
import Avatar from '@material-ui/core/Avatar';
import { CircularProgress } from '@material-ui/core';
import Alert from '../custom/Alert';

// redux
import { connect } from 'react-redux';
import Redux from 'redux';
import { createActions as createUserMetaActions } from '../../redux/actions/user-meta';

// utils
import { __, sprintf } from '@wordpress/i18n';

// API
import putAvatar from '../../api/users/put-avatar';

// constants
import { avatarLimitSize } from '../../constants';

type OwnProps = Record<string, never>;
type StateProps = {
  session: Geolonia.Session;
  userMeta: Geolonia.User;
};
type DispatchProps = {
  setAvatar: (avatarBlobUrl: string | void) => void;
};
type Props = OwnProps & StateProps & DispatchProps;
type State = {
  status: false | 'requesting' | 'success' | 'failure';
  errorMessage: string;
};

const ProfileImageStyle: React.CSSProperties = {
  width: '250px',
  height: '250px',
  fill: '#dedede',
  margin: 'auto',
};

export class AvatarSection extends React.Component<Props, State> {
  private inputFileRef: HTMLInputElement | null;

  constructor(props: Props) {
    super(props);
    this.inputFileRef = null;
    this.state = {
      status: false,
      errorMessage: '',
    };
  }

  onUploadClick = () => {
    this.setState({ status: false, errorMessage: '' });
    if (this.inputFileRef) {
      this.inputFileRef.click();
    }
  };

  onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (file.size > avatarLimitSize * 1024 * 1024) {
        this.setState({
          status: 'failure',
          errorMessage: sprintf(
            __(
              'Upload failed. The avatar image size cannot be larger than %d MB.',
            ),
            avatarLimitSize,
          ),
        });
        return;
      }

      const avatarUrl = URL.createObjectURL(file);
      const prevAvatarUrl = this.props.userMeta.avatarImage;
      this.setState({ status: 'requesting' });

      putAvatar(this.props.session, file).then((result) => {
        if (result.error) {
          this.props.setAvatar(prevAvatarUrl); // roleback
          this.setState({ status: 'failure', errorMessage: result.message });
        } else {
          this.props.setAvatar(avatarUrl);
          this.setState({ status: 'success' });
        }
      });
    }
  };

  render() {
    const { errorMessage, status } = this.state;
    const {
      userMeta: { avatarImage },
    } = this.props;

    return (
      <Typography component="div" align="center">
        {avatarImage ? (
          <Avatar
            src={avatarImage}
            style={{
              ...ProfileImageStyle,
              opacity: this.state.status === 'requesting' ? 0.6 : 1,
            }}
          ></Avatar>
        ) : (
          <PersonIcon style={ProfileImageStyle} />
        )}
        <br />
        <Button
          variant="contained"
          color="default"
          onClick={this.onUploadClick}
        >
          {this.state.status === 'requesting' && (
            <CircularProgress size={16} style={{ marginRight: 8 }} />
          )}
          {__('Upload new picture')}
        </Button>
        <input
          ref={(ref) => (this.inputFileRef = ref)}
          accept="image/*"
          style={{ display: 'none' }}
          id="avatar-file"
          type="file"
          onChange={this.onFileSelected}
        />
        <br />
        {status === 'failure' && errorMessage && (
          <Alert type="danger">{errorMessage}</Alert>
        )}
      </Typography>
    );
  }
}

const mapStateToProps = (state: Geolonia.Redux.AppState): StateProps => ({
  session: state.authSupport.session,
  userMeta: state.userMeta,
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): DispatchProps => ({
  setAvatar: (blobUrl) => dispatch(createUserMetaActions.setAvatar(blobUrl)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AvatarSection);
