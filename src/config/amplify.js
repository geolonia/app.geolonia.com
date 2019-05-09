import Amplify from "aws-amplify";

Amplify.configure({
  Auth: {
    // identityPoolId: "",
    region: "ap-northeast-1",
    userPoolId: "ap-northeast-1_IXPQmujeg",
    userPoolWebClientId: "7iprhuv2gr51d318ncqq2rp4ib"
  }
});
