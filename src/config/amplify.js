import Amplify from "aws-amplify";

const {
  AWS_REGION,
  AWS_COGNITO_USER_POOL_ID,
  AWS_COGNITO_USER_POOL_CLIENT_ID
} = __ENV__;

Amplify.configure({
  Auth: {
    region: AWS_REGION,
    userPoolId: AWS_COGNITO_USER_POOL_ID,
    userPoolWebClientId: AWS_COGNITO_USER_POOL_CLIENT_ID
  }
});
