// CSS
import "../styles/common.css";

import "../config/amplify";
import "isomorphic-fetch";
import { Auth } from "aws-amplify";

const signUpElement = document.getElementById("sign-up");
const usernameElement = document.getElementById("username");
const emailElement = document.getElementById("email");
const passwordElement = document.getElementById("password");
const warningElement = document.getElementById("warning");

const getParams = () => ({
  username: usernameElement.value,
  attributes: { email: emailElement.value },
  password: passwordElement.value
});

const setError = text => {
  warningElement.innerHTML = text || "";
};

signUpElement.addEventListener("click", () => {
  setError(false);
  const params = getParams();

  if (!params.attributes.email) {
    setError("Emailアドレスを入力してください");
  } else {
    Auth.signUp(params)
      .then(() => location.replace(`/app/verify?username=${params.username}`))
      .catch(err => {
        let value = "不明なエラーです";
        if (err) {
          if (typeof err === "string") {
            value = err;
          } else {
            value = err.message || value;
          }
        }
        setError(value);
      });
  }
});

const scrollButtons = document.getElementsByClassName(
  "geolonia-scroll-to-sign-up"
);

scrollButtons.forEach(element =>
  element.addEventListener("click", () =>
    // nextTick
    Promise.resolve().then(() => usernameElement.focus(), 0)
  )
);
