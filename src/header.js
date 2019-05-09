import React from "react";
import { Link } from "react-router-dom";
import { routes } from "./app-router";

export const Header = props => {
  const {
    auth: { isSignIn, username, signout }
  } = props;

  return (
    <nav className={"uk-navbar-container"} uk-navbar={"true"}>
      <div className={"uk-navbar-left"}>
        <ul className={"uk-navbar-nav"}>
          {Object.keys(routes).map(path => {
            const { label, requireSignIn, requireNoSignIn } = routes[path];
            const display =
              (isSignIn && requireSignIn) ||
              (!isSignIn && requireNoSignIn) ||
              (!requireSignIn && !requireNoSignIn);

            return display ? (
              <li key={path}>
                <Link to={path}>{label}</Link>
              </li>
            ) : null;
          })}
          {isSignIn && (
            <li>
              <Link
                to={"#"}
                onClick={() => {
                  signout();
                  window.location.replace("/sign-in/");
                }}
              >
                {"サインアウト"}
              </Link>
            </li>
          )}
          {isSignIn && <li className={"uk-navbar-item"}>{username}</li>}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
