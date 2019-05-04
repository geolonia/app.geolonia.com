import React from "react";
import PropTypes from "prop-types";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./header";
import EmailConfirmation from "./components/email-confirmation";
import HomeRoute from "./routes/home";
import SignUpRoute from "./routes/sign-up";
import VerifyRoute from "./routes/verify";
import SignInRoute from "./routes/sign-in";
import DashboardRoute from "./routes/dashboard";
import ResetPasswordRoute from "./routes/reset-password";

export const routes = {
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
        <Header auth={auth} />
        {auth.userData && !auth.userData.userConfirmed && (
          <EmailConfirmation auth={auth} />
        )}
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

AppRouter.propTypes = {
  auth: PropTypes.shape({
    user: PropTypes.any,
    error: PropTypes.any,
    signup: PropTypes.func.isRequired,
    signin: PropTypes.func.isRequired,
    signout: PropTypes.func.isRequired
  }).isRequired
};

export default AppRouter;
