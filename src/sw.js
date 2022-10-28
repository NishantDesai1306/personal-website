importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js');

if (workbox) {
	console.log(`Yay! Workbox is loaded`);

	workbox.precaching.precacheAndRoute([self.__WB_MANIFEST]);

	workbox.routing.setCatchHandler(({ event }) => {

		switch (event.request.destination) {
			case 'document':
				return caches.match('/offline.html');
				break;
		}
	});
} else {
	console.log(`Boo! Workbox didn't load`)
}

const cachesToRemove = [
	/pages-cache/,
	/workbox-precache/, // enable when I want to remove old image from cache
]
const staticCacheName = 'pages-cache-v4';

self.addEventListener('activate', function (event) {
	event.waitUntil(
		caches.keys().then(function (cacheNames) {
			return Promise.all(
				cacheNames.filter(function (cacheName) {
					return cachesToRemove.some((cacheNameRegex) => cacheNameRegex.test(cacheName))
				}).map(function (cacheName) {
					return caches.delete(cacheName);
				})
			);
		})
	);
});

self.addEventListener('install', (event) => {
	const urls = [
		'https://fonts.googleapis.com/icon?family=Material+Icons',
		'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap',
		'https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmEU9fBBc4.woff2',
		'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxK.woff2'
	];
	const cacheName = workbox.core.cacheNames.runtime;
	event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(urls)));
});

self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') {
		self.skipWaiting();
	}
});

self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request)
			.then(response => {
				if (event.request.url.includes('fonts.')) {
					console.log(event.request.url, response);
				}

				if (response) {
					return response;
				}

				return fetch(event.request)
					.then(response => {
						const contentTypeHeader = response.headers.get('content-type');

						if (
							!event.request.url.startsWith('http') ||
							(
								contentTypeHeader && contentTypeHeader.includes('json')
							)
						) {
							return Promise.resolve(response);
						}

						return caches.open(staticCacheName).then(cache => {
							console.log('caching', event.request.url);
							cache.put(event.request.url, response.clone());
							return response;
						});
					});

			}).catch(error => {

				console.log('errior', error)

			})
	);
});