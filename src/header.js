import React from "react";
import { Link } from "react-router-dom";
import { routes } from "./app-router";

export const Header = props => {
  return (
    <nav className={"uk-navbar-container"} uk-navbar={"true"}>
      <div className={"uk-navbar-left"}>
        <ul className={"uk-navbar-nav"}>
          {Object.keys(routes).map(path => {
            return (
              <li key={path}>
                <Link to={path}>{routes[path].label}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
