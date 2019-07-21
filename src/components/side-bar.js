import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { __ } from "@wordpress/i18n";

const signoutRoutes = [];

const signinRightRoutes = [
  {
    key: 0,
    label: "Maps",
    icon: "world"
  },
  {
    key: 1,
    label: "Features",
    icon: "location"
  },
  {
    key: 2,
    divider: true
  },
  {
    key: 3,
    label: __("sign out", "geolonia-dashboard"),
    handler: ({ auth, history }) => {
      auth.signout();
      history.replace(`/app/sign-in/`);
    },
    icon: "sign-out"
  },
  {
    key: 4,
    label: ({ auth }) => auth.userData.username,
    path: "/app/profile/",
    icon: "user"
  }
];

export const SideBar = props => {
  const {
    auth: { userData }
  } = props;
  const isSignIn = !!userData;
  const rightRoutes = isSignIn ? signinRightRoutes : signoutRoutes;

  // eslint-disable-next-line
  const renderItem = props => ({
    key,
    divider,
    label,
    path,
    handler,
    icon
  }) => {
    if (divider) {
      return <li key={key} dclassName="uk-nav-divider"></li>;
    } else {
      return (
        <li key={key}>
          <Link
            to={path || "#"}
            onClick={
              "function" === typeof handler ? () => handler(props) : void 0
            }
            style={{ color: "white" }}
          >
            {icon && (
              <span
                className={"uk-margin-small-right"}
                uk-icon={`icon: ${icon}`}
              ></span>
            )}
            {"function" === typeof label ? label(props) : label}
          </Link>
        </li>
      );
    }
  };

  return (
    <div className={"bar-wrap"}>
      <ul className={"uk-nav-default uk-nav-parent-icon"} uk-nav={"true"}>
        <li className={"uk-active"}>{"Apps"}</li>
        {rightRoutes.map(renderItem(props))}
      </ul>
    </div>
  );
};

SideBar.propTypes = {
  auth: PropTypes.any
};

export default SideBar;
