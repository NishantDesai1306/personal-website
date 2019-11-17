const toggleClasses = (selectorClassName, classToToggle, shouldAdd) => {
	debugger;
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
window.addEventListener('beforeinstallprompt', (e) => {
	e.preventDefault();
	window.deferredPrompt = e;
	toggleClasses('install-handle', 'd-none', false);
});
