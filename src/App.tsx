import React, { useState } from "react";
import { context as NotificationContext, NotificationState, initialNotificationState } from "./contexts/notification";

import "./App.scss";
import Paperbase from "./components/Paperbase";
import AuthContainer from "./auth/container";
import { Provider } from "react-redux";
import store from "./redux/store";

const App: React.FC = () => {
  const [notification, setNotification] = useState<NotificationState>(initialNotificationState)

  return (
    <Provider store={store}>
      <AuthContainer>
        <NotificationContext.Provider value={
          {
            state: notification,
            updateState: ((nextState: any) => setNotification(nextState)) as any
          }
        }>
          <Paperbase />
        </NotificationContext.Provider>
      </AuthContainer>
    </Provider>
  );
};

export default App;
