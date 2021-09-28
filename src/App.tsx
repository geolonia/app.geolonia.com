import React, { useState } from 'react';
import { context as NotificationContext, NotificationState, initialNotificationState } from './contexts/notification';

import './App.scss';
import Paperbase from './components/Paperbase';
import AuthContainer from './auth/container';
import { Provider } from 'react-redux';
import store from './redux/store';
import { HashRouter as Router } from 'react-router-dom';

const App: React.FC = () => {
  const [notification, setNotification] = useState<NotificationState>(initialNotificationState);

  return (
    <Provider store={store}>
      <AuthContainer>
        <NotificationContext.Provider value={
          {
            state: notification,
            updateState: ((nextState: any) => setNotification(nextState)) as any,
          }
        }>
          <Router>
            <Paperbase />
          </Router>
        </NotificationContext.Provider>
      </AuthContainer>
    </Provider>
  );
};

export default App;
