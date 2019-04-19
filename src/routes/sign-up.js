import React from "react";

export const SignUpRoute = props => {
  const {
    auth: { signup }
  } = props;
  return (
    <main>
      <h2>{"sign up"}</h2>
    </main>
  );
};

export default SignUpRoute;
