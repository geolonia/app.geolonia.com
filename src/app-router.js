import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./header";
import HomeRoute from "./routes/home";
import SignUpRoute from "./routes/sign-up";
import VerifyRoute from "./routes/verify";
import ResendCodeRoute from "./routes/resend";
import SignInRoute from "./routes/sign-in";
import DashboardRoute from "./routes/dashboard";
import ResetPasswordRoute from "./routes/reset-password";

const routes = {
  "/": {
    label: "home",
    Component: HomeRoute
  },
  "/sign-up/": {
    requireNoSignIn: true,
    label: "サインアップ",
    Component: SignUpRoute
  },
  "/verify/": {
    label: "コード認証",
    Component: VerifyRoute
  },
  "/resend": {
    label: "コード再送",
    Component: ResendCodeRoute
  },
  "/sign-in/": {
    requireNoSignIn: true,
    label: "サインイン",
    Component: SignInRoute
  },
  "/dashboard/": {
    requireSignIn: true,
    label: "ダッシュボード",
    Component: DashboardRoute
  },
  "/reset_password/": {
    label: "パスワードリセット",
    Component: ResetPasswordRoute
  }
};

const AppRouter = props => {
  const { auth } = props;
  return (
    <Router>
      <div className={"uk-container uk-container-xsmall"}>
        <Route path="/" render={props => <Header {...props} auth={auth} />} />

        {Object.keys(routes).map(path => {
          const { Component } = routes[path];
          return (
            <Route
              key={path}
              path={path}
              exact
              render={props => <Component {...props} auth={auth} />}
            />
          );
        })}
      </div>
    </Router>
  );
};

export default AppRouter;
