import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { __ } from "@wordpress/i18n";

export const ProfileRoute = props => {
  const { userData } = props.auth;
  return (
    <main
      className={
        "geolonia-app uk-container uk-container-xsmall uk-margin uk-padding-small"
      }
    >
      <ul className={"uk-breadcrumb"}>
        <li className={"uk-text-uppercase"}>
          <Link to={"/app/maps"}>{__("maps", "geolonia-dashboard")}</Link>
        </li>
        <li>{__("profile", "geolonia-dashboard")}</li>
      </ul>
      <div className={"uk-card uk-card-default uk-card-body"}>
        <h3>{__("profile", "geolonia-dashboard")}</h3>
        {userData ? (
          <div>
            <dl className={"uk-description-list"}>
              <dt className={"uk-text-uppercase"}>
                {__("user name", "geolonia-dashboard")}
              </dt>
              <dd>{userData.username}</dd>
            </dl>

            <dl className={"uk-description-list"}>
              <dt className={"uk-text-uppercase"}>
                {__("email", "geolonia-dashboard")}
              </dt>
              <dd>{userData.attributes.email}</dd>
            </dl>

            <dl className={"uk-description-list"}>
              <dt className={"uk-text-uppercase"}>
                {__("password", "geolonia-dashboard")}
              </dt>
              <dd>
                <Link
                  to={`/app/reset_password?email=${userData.attributes.email}`}
                >
                  {__("Reset password", "geolonia-dashboard")}
                </Link>
              </dd>
            </dl>
          </div>
        ) : null}
      </div>
    </main>
  );
};

ProfileRoute.propTypes = {
  auth: PropTypes.shape({
    userData: PropTypes.shape({
      username: PropTypes.string,
      attributes: PropTypes.shape({
        email: PropTypes.string
      })
    })
  }).isRequired
};

export default ProfileRoute;
