const cacheName = 'rest-rev-v1';

const filesToCache = [
	'/',
	'/index.html',
	'/restaurant.html?id=1',
	'/restaurant.html?id=2',
	'/restaurant.html?id=3',
	'/restaurant.html?id=4',
	'/restaurant.html?id=5',
	'/restaurant.html?id=6',
	'/restaurant.html?id=7',
	'/restaurant.html?id=8',
	'/restaurant.html?id=9',
	'/restaurant.html?id=10',
	'/css/styles.css',
	'/js/main.js',
	'/js/dbhelper.js',
	'/js/restaurant_info.js',
	'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js',
	'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
	'/data/restaurants.json',
	'/img/1.jpg',
	'/img/2.jpg',
	'/img/3.jpg',
	'/img/4.jpg',
	'/img/5.jpg',
	'/img/6.jpg',
	'/img/7.jpg',
	'/img/8.jpg',
	'/img/9.jpg',
	'/img/10.jpg'
];

function registerServiceWorker() {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker
			.register('/service-worker.js')
			.then(response => {
				console.log(
					'Service worker registeration successful',
					response
				);
			})
			.catch(err => {
				console.log('Service worker registeration failed', err);
			});
	}
}
registerServiceWorker();

self.addEventListener('install', e => {
	e.waitUntil(
		caches.open(cacheName).then(cache => {
			console.log('Caching ', filesToCache);
			return cache.addAll(filesToCache);
		})
	);
});

self.addEventListener('fetch', e => {
	console.log('Fetching', e.request.url);
	e.respondWith(
		caches.match(e.request).then(response => {
			if (response) {
				console.log('Found', e.request.url, ' in cache');
				return response;
			} else {
				console.log(e.request, ' not found in cache');
				return fetch(e.request)
					.then(response => {
						const responseTwin = response.clone();
						caches.open(cacheName).then(cache => {
							cache.put(e.request, responseTwin);
						});
						return response;
					})
					.catch(err => {
						console.log(err);
					});
			}
		})
	);
});
