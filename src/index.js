import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';


import 'bootstrap-utilities/bootstrap-utilities.css';
import 'bootstrap-grid-only-css/dist/css/bootstrap-grid.min.css';

import './event-listeners'
import App from './App';
import theme from './theme';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

ReactDOM.render(
  <ThemeProvider theme={theme}>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    <App />
  </ThemeProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register({
  onSuccess: () => {},
  onUpdate: reg => {
    window.deferredUpdate = reg;
    document.querySelector('#app-update').classList.remove('d-none');
  },
});

