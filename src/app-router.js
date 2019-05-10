import React from "react";
import PropTypes from "prop-types";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./header";
import HomeRoute from "./routes/home";
import SignUpRoute from "./routes/sign-up";
import VerifyRoute from "./routes/verify";
import ResendCodeRoute from "./routes/resend";
import SignInRoute from "./routes/sign-in";
import DashboardRoute from "./routes/dashboard";
import ProfileRoute from "./routes/profile";
import ResetPasswordRoute from "./routes/reset-password";

const routes = {
  "/": {
    Component: HomeRoute
  },
  "/sign-up/": {
    Component: SignUpRoute
  },
  "/verify/": {
    Component: VerifyRoute
  },
  "/resend": {
    Component: ResendCodeRoute
  },
  "/sign-in/": {
    Component: SignInRoute
  },
  "/dashboard/": {
    Component: DashboardRoute
  },
  "/profile/": {
    Component: ProfileRoute
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

AppRouter.propTypes = {
  auth: PropTypes.object.isRequired
};

export default AppRouter;
