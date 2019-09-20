import React from "react";

type Props = {
  isLoggedIn: boolean;
  history: {
    replace: (path: string) => void;
  };
};

type State = {};

export const RouteController = (props: Props) => {
  const { isLoggedIn, history } = props;
  React.useEffect(() => {
    isLoggedIn || history.replace("/signin");
  }, [isLoggedIn]);

  return <></>;
};

export default RouteController;
