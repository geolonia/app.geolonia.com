import React from "react";
import AuthContainer from "./container/auth";
import AppRouter from "./app-router";
import "uikit/dist/css/uikit.min.css";
import "uikit/dist/js/uikit-icons.min.js";
import "./App.css";

const App = () => <AuthContainer Root={AppRouter} />;

export default App;
