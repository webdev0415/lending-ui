import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import ConnectionProvider from './contexts/connection';

ReactDOM.render(
  <ConnectionProvider>
  <React.StrictMode>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </React.StrictMode>
  </ConnectionProvider>,
  document.getElementById('root')
);
