import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export const ProfileRoute = props => {
  const { userData } = props.auth;
  return (
    <main
      className={
        "tilecloud-app uk-container uk-container-xsmall uk-margin uk-padding-small"
      }
    >
      <div className={"uk-card uk-card-default uk-card-body"}>
        <h3>{"Profile"}</h3>
        {userData ? (
          <div>
            <dl className={"uk-description-list"}>
              <dt>{"username"}</dt>
              <dd>{userData.username}</dd>
            </dl>
            <dl className={"uk-description-list"}>
              <dt>{"email"}</dt>
              <dd>{userData.attributes.email}</dd>
            </dl>
            <dl className={"uk-description-list"}>
              <dt>{"forget password"}</dt>
              <dd>
                <Link to={"/app/reset_password"}>{"reset"}</Link>
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
