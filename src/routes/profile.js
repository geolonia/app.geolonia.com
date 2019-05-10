import React from "react";
import { Link } from "react-router-dom";

export const ProfileRoute = props => {
  const { userData } = props.auth;
  console.log(userData);
  return (
    <main className={"uk-margin"}>
      <h3>{"Profile"}</h3>
      {userData ? (
        <div>
          <dl className="uk-description-list">
            <dt>{"username"}</dt>
            <dd>{userData.username}</dd>
          </dl>
          <dl className="uk-description-list">
            <dt>{"email"}</dt>
            <dd>{userData.attributes.email}</dd>
          </dl>
          <dl className="uk-description-list">
            <dt>{"forget password"}</dt>
            <dd>
              <Link to="/reset_password/">{"reset"}</Link>
            </dd>
          </dl>
        </div>
      ) : null}
    </main>
  );
};

export default ProfileRoute;
