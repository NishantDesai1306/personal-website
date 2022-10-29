import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';

import App from './App';
import theme from './theme';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import 'bootstrap-utilities/bootstrap-utilities.css';
import 'bootstrap-grid-only-css/dist/css/bootstrap-grid.min.css';

ReactDOM.render(
  <ThemeProvider theme={theme}>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    <App />
  </ThemeProvider>,
  document.getElementById('root')
);






//service worker related changes
const toggleClasses = (selectorClassName, classToToggle, shouldAdd) => {
	const installHandles = document.getElementsByClassName(selectorClassName);

	for (let i = 0; i < installHandles.length; ++i) {
		const handleElement = installHandles.item(i);

		if (shouldAdd) {
			handleElement.classList.add(classToToggle);
		}
		else {
			handleElement.classList.remove(classToToggle);
		}
	}
}

window.showInstallPrompt = () => {
	window.deferredPrompt.prompt();

	// Wait for the user to respond to the prompt
	window.deferredPrompt.userChoice
		.then((choiceResult) => {
			if (choiceResult.outcome === 'accepted') {
				console.log('User accepted the A2HS prompt');
			} else {
				console.log('User dismissed the A2HS prompt');
			}

			toggleClasses('install-handle', 'd-none', true)
			window.deferredPrompt = null;
		});
}

const isReachable = (url) => {
  return fetch(url, { method: 'HEAD', mode: 'no-cors' })
		.then((resp) => {
			return resp && (resp.ok || resp.type === 'opaque');
		})
		.catch((err) => {
			console.warn('[conn test failure]:', err);
		});
}

const handleConnection = () => {
	if (navigator.onLine) {
		isReachable('/').then((online) => {
			if (online) {
				toggleClasses('uses-internet', 'Mui-disabled', false);
			} else {
				toggleClasses('uses-internet', 'Mui-disabled', true);
			}
		});
	} else {
		toggleClasses('uses-internet', 'Mui-disabled', true);
	}
}

window.addEventListener('online', handleConnection);
window.addEventListener('offline', handleConnection);

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

