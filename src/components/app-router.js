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
import NextDashboardRoute from "./routes/dashboard-next";
import ProfileRoute from "./routes/profile";
import ResetPasswordRoute from "./routes/reset-password";

const routes = {
  "/app": {
    Component: HomeRoute
  },
  "/app/sign-up": {
    Component: SignUpRoute
  },
  "/app/verify": {
    Component: VerifyRoute
  },
  "/app/resend": {
    Component: ResendCodeRoute
  },
  "/app/sign-in": {
    Component: SignInRoute
  },
  "/app/dashboard": {
    Component: DashboardRoute
  },
  "/app/next-dashboard": {
    Component: NextDashboardRoute
  },
  "/app/profile": {
    Component: ProfileRoute
  },
  "/app/reset_password": {
    Component: ResetPasswordRoute
  }
};

const AppRouter = props => {
  const { auth } = props;
  return (
    <Router>
      <>
        <Route path={"/app"} render={props => <Header {...props} auth={auth} />} />

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
      </>
    </Router>
  );
};

AppRouter.propTypes = {
  auth: PropTypes.object.isRequired
};

export default AppRouter;
