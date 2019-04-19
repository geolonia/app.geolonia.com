import React from "react";
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

const AppRouter = () => (
  <Router>
    <Header />
    {Object.keys(routes).map(path => (
      <Route key={path} path={path} exact component={routes[path].Component} />
    ))}
  </Router>
);

export default AppRouter;
