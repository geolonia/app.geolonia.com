import "../config/amplify";
import "isomorphic-fetch";
import { Auth } from "aws-amplify";

document.getElementById("sign-up").addEventListener("click", () => {
  const params = {
    username: document.getElementById("username").value,
    attributes: {
      email: document.getElementById("email").value
    },
    password: document.getElementById("password").value
  };
  Auth.signUp(params)
    .then(() => location.replace(`/app/verify?username={params.username}`))
    .catch(err => console.error(err));
});
