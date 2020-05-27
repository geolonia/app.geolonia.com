import "./ResetPassword.scss";
import React from "react";
import { connect } from "react-redux";

// Utils
import queryString from "query-string";
import { AppState, Session } from "../types";
import customFetch from "../lib/fetch";

const parsed = queryString.parse(window.location.search);

type Props = { isReady: boolean; session: Session };

const AcceptInvitation = (props: Props) => {
  const { isReady, session } = props;
  React.useEffect(() => {
    if (isReady) {
      const { invitationToken } = parsed;

      if (typeof invitationToken !== "string") {
        // TODO: リダイレクトしてもいいかも
        return;
      }

      const dashboardToken = (session
        ? session.getIdToken().getJwtToken()
        : void 0) as string; // ログインしているならセッションを送って即加入するし、していないなら Geolonia のデータベースに予約のためのレコードを入れておく
      const urlBase = `https://api.app.geolonia.com/${process.env.REACT_APP_STAGE}`;
      const fetchOptions = {
        method: "POST",
        headers: { "Content-Type": "Application/json" },
        body: JSON.stringify({ invitationToken, dashboardToken })
      };

      (session
        ? customFetch(session, `${urlBase}/accept-invitation`, fetchOptions)
        : fetch(`${urlBase}/reserve-affiliation`)
      ).catch(console.error);
      // .then(() => (window.location.href = "/"));
    }
  }, [isReady, session]);
  return <></>;
};

const mapStateToProps = (appState: AppState): Props => {
  return {
    isReady: appState.authSupport.isReady,
    session: appState.authSupport.session
  };
};

export default connect(mapStateToProps)(AcceptInvitation);
