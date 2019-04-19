import React from "react";
import { Link } from "react-router-dom";
import { routes } from "./app-router";

export const Header = props => {
  const {
    auth: { user, signout }
  } = props;
  return (
    <nav className={"uk-navbar-container"} uk-navbar={"true"}>
      <div className={"uk-navbar-left"}>
        <ul className={"uk-navbar-nav"}>
          {Object.keys(routes).map(path => {
            const { requireSignin, requireNoSignin, label } = routes[path];
            if (requireSignin && !user) {
              return null;
            } else if (requireNoSignin && user) {
              return null;
            } else {
              return (
                <li key={path}>
                  <Link to={path}>{label}</Link>
                </li>
              );
            }
          })}
          {user && (
            <li>
              <Link to={"#"} onClick={signout}>
                {"サインアウト"}
              </Link>
            </li>
          )}
          {user && <li className={"uk-navbar-item"}>{user.email}</li>}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
