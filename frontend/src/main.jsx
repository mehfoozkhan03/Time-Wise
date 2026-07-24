import React from 'react';

import ReactDOM from 'react-dom/client';

import App from './App';

import './styles/global.css';

import { ThemeProvider } from './context/ThemeContext';

import { AuthProvider } from './context/AuthContext';

import { Provider } from 'react-redux';

import store from '../src/store/store.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  </>,
);
