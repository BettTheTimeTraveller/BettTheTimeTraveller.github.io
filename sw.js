const staticAssets = [
    './', './styles/style.css', './styles/bootstrap.min.css', './styles/font-awesome.min.css', './manifest.json', './js/app.js', './dist/main.js'
];

self.addEventListener('install', function(event) {
    console.log('Service worker installed');

    event.waitUntil(
        caches.open('currency-static').then(function(cache) {
            cache.addAll(staticAssets);

        })
    );
});

self.addEventListener('activate', event => {
    console.log('Service worker activated');
});


self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
        .then(function(res) {
            if (res) {
                return res;
            } else {
                return fetch(event.request);
            }
        })
    );
})

/* self.addEventListener('fetch', event => {
    const req = event.request;
    event.repondWith(cacheFirst(req));
});

async function cacheFirst(req) {
    const cachedResponse = await caches.match(req);
    return cachedResponse || fetch(req);
} */