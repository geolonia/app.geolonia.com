import React from "react";
import { Link } from "react-router-dom";

const signoutRoutes = [
  { key: 0, label: "Home", path: "/" },
  { key: 1, label: "Sign up", path: "/sign-up/" },
  { key: 2, label: "Sign in", path: "/sign-in/" }
];

const signinRoutes = [
  { key: 0, label: "Home", path: "/" },
  {
    key: 1,
    label: "Logout",
    handler: ({ auth, history }) => {
      auth.signout();
      history.replace("/sign-in/");
    }
  },
  {
    key: 2,
    label: ({ auth }) => auth.userData.username
  }
];

export const Header = props => {
  const {
    auth: { userData }
  } = props;
  console.log(props);
  const isSignIn = !!userData;
  const routes = isSignIn ? signinRoutes : signoutRoutes;
  return (
    <nav className={"uk-navbar-container"} uk-navbar={"true"}>
      <div className={"uk-navbar-left"}>
        <ul className={"uk-navbar-nav"}>
          {routes.map(({ key, label, path, handler }) => {
            return (
              <li key={key}>
                <Link
                  to={path || "#"}
                  onClick={
                    typeof handler === "function"
                      ? () => handler(props)
                      : void 0
                  }
                >
                  {typeof label === "function" ? label(props) : label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
