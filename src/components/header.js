import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { primary } from "../colors";

const signoutRoutes = [];

const signinRightRoutes = [
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
    path: "/app/profile/"
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
  const rightRoutes = isSignIn ? signinRightRoutes : signoutRoutes;
  return (
    <nav
      className={"tilecloud-header uk-navbar-container"}
      uk-navbar={"true"}
      style={{ background: primary }}
    >
      <div className={"tilecloud-header-content uk-navbar-right"}>
        <ul className={"uk-navbar-nav"}>
          {rightRoutes.map(renderItem(props))}
        </ul>
      </div>
    </nav>
  );
};

Header.propTypes = {
  auth: PropTypes.any
};

export default Header;
