import Amplify from "aws-amplify";

const {
  REACT_APP_AWS_REGION,
  REACR_APP_AWS_COGNITO_USER_POOL_ID,
  REACT_APP_AWS_COGNITO_USER_POOL_CLIENT_ID
} = process.env;

Amplify.configure({
  Auth: {
    region: REACT_APP_AWS_REGION,
    userPoolId: REACR_APP_AWS_COGNITO_USER_POOL_ID,
    userPoolWebClientId: REACT_APP_AWS_COGNITO_USER_POOL_CLIENT_ID
  }
});
