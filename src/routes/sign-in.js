import React from "react";

export const SignInRoute = props => {
  const {
    auth: { signin }
  } = props;
  return (
    <main>
      <h2>{"sign in"}</h2>
    </main>
  );
};

export default SignInRoute;
