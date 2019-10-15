import { connect } from "react-redux";
import { AppState } from "../../../redux/store";
import Redux from "redux";
import { createActions as createUserMetaActions } from "../../../redux/actions/user-meta";
// types
import AmazonCognitoIdentity from "amazon-cognito-identity-js";
import { UserMetaState } from "../../../redux/actions/user-meta";

export type StateProps = {
  session?: AmazonCognitoIdentity.CognitoUserSession;
  userMeta: UserMetaState;
};
export type DispatchProps = {
  setAvatar: (avatarBlobUrl: string | void) => void;
};

const mapStateToProps = (state: AppState): StateProps => ({
  session: state.authSupport.session,
  userMeta: state.userMeta
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): DispatchProps => ({
  setAvatar: blobUrl => dispatch(createUserMetaActions.setAvatar(blobUrl))
});

export default (Component: any) => {
  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(Component);
};
