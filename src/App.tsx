import React from 'react';

import './App.scss';
import Paperbase from './components/Paperbase'

import {Provider} from 'react-redux'
import store from './redux/store'

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Paperbase></Paperbase>
    </Provider>
  );
}

export default App;
