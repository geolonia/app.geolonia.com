import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { primary } from "../colors";

const signoutRoutes = [];

const signinRoutes = [
  { key: 1, label: "Dashboard", path: "/dashboard/" },
  { key: 1.5, label: "Next Dashboard", path: "/next-dashboard/" },
  {
    key: 2,
    label: "Sign out",
    handler: ({ auth, history }) => {
      auth.signout();
      history.replace(`/app/sign-in/`);
    }
  },
  {
    key: 3,
    label: ({ auth }) => auth.userData.username,
    path: "/profile/"
  }
];

// eslint-disable-next-line
const renderItem = props => ({ key, label, path, handler }) => {
  return (
    <li key={key}>
      <Link
        to={path || "#"}
        onClick={"function" === typeof handler ? () => handler(props) : void 0}
        style={{ color: "white" }}
      >
        {"function" === typeof label ? label(props) : label}
      </Link>
    </li>
  );
};

export const Header = props => {
  const {
    auth: { userData }
  } = props;
  const isSignIn = !!userData;
  const routes = isSignIn ? signinRoutes : signoutRoutes;
  return (
    <nav
      className={"uk-navbar-container"}
      uk-navbar={"true"}
      style={{ background: primary }}
    >
      <div className={"uk-navbar-left"}>
        <ul className={"uk-navbar-nav"}>{routes.map(renderItem(props))}</ul>
      </div>
    </nav>
  );
};

Header.propTypes = {
  auth: PropTypes.any
};

export default Header;
