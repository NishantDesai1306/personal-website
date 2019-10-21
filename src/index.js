import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';
import { Workbox } from "workbox-window";

import App from './App';
import theme from './theme';

import 'bootstrap-utilities/bootstrap-utilities.css';
import 'bootstrap-grid-only-css/dist/css/bootstrap-grid.min.css';

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const wb = new Workbox("/sw.js");

    const updateButton = document.querySelector("#app-update");
    
    wb.addEventListener("waiting", event => {
      updateButton.classList.remove("d-none");
      updateButton.addEventListener("click", () => {
        
        wb.addEventListener("controlling", event => {
          window.location.reload();
        });

        wb.messageSW({ type: "SKIP_WAITING" });
      });
    });
    
    wb.register();
  });

}

ReactDOM.render(
  <ThemeProvider theme={theme}>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    <App />
  </ThemeProvider>,
  document.querySelector('#root'),
);
