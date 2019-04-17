import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import HomeRoute from "./routes/home";
import SignUpRoute from "./routes/sign-up";
import SignInRoute from "./routes/sign-in";
import DashboardRoute from "./routes/dashboard";

const AppRouter = () => (
  <Router>
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/sign-in/">{"サインアップ"}</Link>
          </li>
          <li>
            <Link to="/sign-up/">{"サインイン"}</Link>
          </li>
          <li>
            <Link to="/dashboard/">{"ダッシュボード"}</Link>
          </li>
        </ul>
      </nav>

      <Route path="/" exact component={HomeRoute} />
      <Route path="/sign-in/" component={SignInRoute} />
      <Route path="/sign-up/" component={SignUpRoute} />
      <Route path="/dashboard/" component={DashboardRoute} />
    </div>
  </Router>
);

export default AppRouter;
