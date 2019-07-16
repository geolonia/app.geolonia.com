import "../config/i18n";
import React from "react";
import ReactDOM from "react-dom";
import App from "../components/app";
import * as serviceWorker from "../lib/service-worker";
import "../config/amplify";
import "isomorphic-fetch";

// CSS
import "../styles/app.css";

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
