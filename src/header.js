import React from "react";
import { Link } from "react-router-dom";
import { routes } from "./app-router";

export const Header = props => {
  const {
    auth: { userData, signout }
  } = props;
  return (
    <nav className={"uk-navbar-container"} uk-navbar={"true"}>
      <div className={"uk-navbar-left"}>
        <ul className={"uk-navbar-nav"}>
          {Object.keys(routes).map(path => {
            const { label } = routes[path];
            return (
              <li key={path}>
                <Link to={path}>{label}</Link>
              </li>
            );
          })}
          {userData && (
            <li>
              <Link to={"#"} onClick={signout}>
                {"サインアウト"}
              </Link>
            </li>
          )}
          {userData && (
            <li className={"uk-navbar-item"}>{userData.user.username}</li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
