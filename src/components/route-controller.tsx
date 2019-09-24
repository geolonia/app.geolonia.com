import React from "react";

type Props = {
  isLoggedIn: boolean;
  history: {
    location: {
      pathname: string;
    };
    replace: (path: string) => void;
  };
};

type State = {};

export const RouteController = (props: Props) => {
  const {
    isLoggedIn,
    history: {
      location: { pathname },
      replace
    }
  } = props;

  React.useEffect(() => {
    !isLoggedIn &&
      pathname !== "/signup" &&
      pathname !== "/forgot-password" &&
      replace("/signin");
  }, []);

  return <></>;
};

export default RouteController;
