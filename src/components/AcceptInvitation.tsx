import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import Button from "@material-ui/core/Button";

// Utils
import { AppState } from "../types";
import { __ } from "@wordpress/i18n";
import { connect } from "react-redux";

type OwnProps = { isReady: boolean };
type RouterProps = {
  history: { replace: (pathname: string) => void };
  match: { params: { invitationToken: string } };
};
type Props = OwnProps & RouterProps;

const useInvitationAcceptRequest = (props: Props) => {
  const [status, setStatus] = React.useState<
    false | "success" | "failure" | "requesting"
  >(false);

  const {
    isReady,
    history,
    match: {
      params: { invitationToken }
    }
  } = props;

  React.useEffect(() => {
    if (isReady && status === false) {
      setStatus("requesting");
      fetch(
        `https://api.app.geolonia.com/${process.env.REACT_APP_STAGE}/accept-invitation`,
        {
          method: "POST",
          headers: { "Content-Type": "Application/json" },
          body: JSON.stringify({ invitationToken })
        }
      )
        .then(res => {
          if (res.status < 400) {
            setStatus("success");
          } else {
            throw res.json();
          }
        })
        .catch(error => {
          console.error(error);
          setStatus("failure");
        });
    }
  }, [history, invitationToken, isReady, status]);

  return { status, proceed: () => history.replace("/") };
};

const AcceptInvitation = (props: Props) => {
  const { status, proceed } = useInvitationAcceptRequest(props);

  const open = status === "success" || status === "failure";

  let message = "";
  let buttonColor: "primary" | "secondary" = "primary";
  switch (status) {
    case "success":
      message = __("Your invitation has been validated.");
      break;
    case "failure":
      message = __("Your invitation has been outdated.");
      buttonColor = "secondary";
      break;
  }
  return (
    <Snackbar
      style={{ top: 50, backgroundColor: "primary" }}
      message={message}
      open={open}
      action={
        <Button color={buttonColor} size="small" onClick={proceed}>
          {"continue"}
        </Button>
      }
    ></Snackbar>
  );
};

const mapStateToProps = (appState: AppState): OwnProps => {
  return {
    isReady: appState.authSupport.isReady
  };
};

export default connect(mapStateToProps)(AcceptInvitation);
