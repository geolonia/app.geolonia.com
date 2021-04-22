import React from "react";
import { refreshSession } from "../../../../auth";

export default function useWebSocket(
  session: Geolonia.Session,
  teamId: string | void,
  geojsonId: string | void
): [WebSocket | null, boolean, () => void] {
  const [socket, setSocket] = React.useState<WebSocket | null>(null);
  const [updateRequired, setUpdateRequired] = React.useState(false);

  // WebSocket Connection
  React.useEffect(() => {
    if (session && teamId && !socket) {
      refreshSession(session).then(session => {
        const idToken = session.getIdToken().getJwtToken();
        const ws = new WebSocket(
          `wss://ws-api.geolonia.com/${process.env.REACT_APP_STAGE}`
        );

        ws.onopen = () => {
          const message: Geolonia.WebSocket.UpstreamAuthorizeMessage = {
            action: "authorize",
            data: {
              teamId: teamId as string,
              token: idToken
            }
          };
          ws.send(JSON.stringify(message));
        };

        ws.onmessage = rawMessage => {
          try {
            const message = JSON.parse(rawMessage.data);
            if (message) {
              if (message.action === "ack") {
                setSocket(ws);
              } else if (
                message.action === "notify" &&
                geojsonId === message.data.geojsonId
              ) {
                setUpdateRequired(true);
              }
            } else {
              throw new Error();
            }
          } catch (error) {
            // no-op
          }
        };

        ws.onerror = () => {
          setSocket(null);
        };
      });
    }
  }, [geojsonId, session, teamId, socket, updateRequired]);

  return [socket, updateRequired, () => setUpdateRequired(false)];
}
