import React from "react";
import { Link } from "react-router-dom";
import { routes } from "./app-router";

export const Header = () => (
  <nav>
    <ul>
      {Object.keys(routes).map(path => (
        <li key={path}>
          <Link to={path}>{routes[path].label}</Link>
        </li>
      ))}
    </ul>
  </nav>
);

export default Header;
