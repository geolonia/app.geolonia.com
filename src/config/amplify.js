import Amplify from "aws-amplify";

Amplify.configure({
  Auth: {
    identityPoolId: "cognitof87f5aed_identitypool_f87f5aed__dev",
    region: "ap-northeast-1",
    userPoolId: "ap-northeast-1_akYZvWs3S",
    userPoolWebClientId: "7cufvo12jk265pfp5s83m0rrvm"
  }
});
