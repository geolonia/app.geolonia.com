import Amplify from "aws-amplify";

const {
  REACT_APP_AWS_REGION,
  REACT_APP_AWS_COGNITO_USER_POOL_ID,
  REACT_APP_AWS_COGNITO_USER_POOL_CLIENT_ID
} = __ENV__;

Amplify.configure({
  Auth: {
    region: REACT_APP_AWS_REGION,
    userPoolId: REACT_APP_AWS_COGNITO_USER_POOL_ID,
    userPoolWebClientId: REACT_APP_AWS_COGNITO_USER_POOL_CLIENT_ID
  }
});
