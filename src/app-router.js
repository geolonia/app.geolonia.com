import React from "react";
import PropTypes from "prop-types";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./header";
import HomeRoute from "./routes/home";
import SignUpRoute from "./routes/sign-up";
import SignInRoute from "./routes/sign-in";
import DashboardRoute from "./routes/dashboard";

export const routes = {
  "/": { label: "home", Component: HomeRoute },
  "/sign-up/": { label: "サインアップ", Component: SignUpRoute },
  "/sign-in/": { label: "サインイン", Component: SignInRoute },
  "/dashboard/": { label: "ダッシュボード", Component: DashboardRoute }
};

const AppRouter = props => {
  const { auth } = props;
  return (
    <Router>
      <Header />
      {Object.keys(routes).map(path => {
        const { Component } = routes[path];
        return (
          <Route
            key={path}
            path={path}
            exact
            render={() => <Component auth={auth} />}
          />
        );
      })}
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
