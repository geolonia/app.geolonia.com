import { createContext } from 'react';

export type NotificationState = {
  open: boolean;
  message: string;
  type: 'success' | 'failure'
}

export const initialNotificationState: NotificationState = {
  open: false,
  message: '',
  type: 'success',
};
export const initialContext = {
  state: initialNotificationState,
  updateState: (state: NotificationState) => state,
};

const NotificationContext = createContext(initialContext);

export const context = NotificationContext;
