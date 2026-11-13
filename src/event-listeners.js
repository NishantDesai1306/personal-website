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

window.showInstallPrompt = async () => {
	const prompt = window.deferredPrompt;
	if (!prompt) return;
	window.deferredPrompt = null;
	toggleClasses('install-handle', 'd-none', true);
	try {
		// Keep the native handoff synchronous with the user's click.
		await prompt.prompt();
		await prompt.userChoice;
	} catch (error) {
		console.warn('Installation is unavailable in this browser.', error);
	}
};

// Links remain usable offline: the resume is cached and email can open a local
// mail client. A cosmetic Mui-disabled class is not a connectivity policy.
window.addEventListener('beforeinstallprompt', (e) => {
	e.preventDefault();
	window.deferredPrompt = e;
	toggleClasses('install-handle', 'd-none', false);
});
