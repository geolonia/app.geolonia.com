import React from 'react';
import AuthContainer from './container/auth';
import AppRouter from './app-router';
import 'uikit/dist/css/uikit.min.css';
import 'isomorphic-fetch';
import './App.css';

const App = () => <AuthContainer Root={AppRouter} />;

export default App;
