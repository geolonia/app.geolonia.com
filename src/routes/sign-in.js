import React from "react";

export const SignInRoute = props => {
  const {
    auth: { signin }
  } = props;
  return (
    <main className={"uk-margin uk-padding-small"}>
      <h3 className="uk-card-title">{"sign in"}</h3>
      <form className="uk-form-horizontal">
        <div className="uk-margin">
          <label className="uk-form-label" htmlFor="email">
            {"email"}
          </label>
          <div className="uk-form-controls">
            <input
              className="uk-input"
              id="email"
              type="email"
              placeholder="name@example.com"
            />
          </div>
        </div>

        <div className="uk-margin">
          <label className="uk-form-label" htmlFor="password">
            {"password"}
          </label>
          <div className="uk-form-controls">
            <input className="uk-input" id="password" type="password" />
          </div>
        </div>

        <div class="uk-margin uk-flex uk-flex-right">
          <button class="uk-button uk-button-default">{"sign in"}</button>
        </div>
      </form>
    </main>
  );
};

export default SignInRoute;
