const CACHE_STATIC_NAME = 'static-v2';
const CACHE_DYNAMIC_NAME = 'dynamic-v1';

self.addEventListener('install', e => {
    console.log('[Service Worker] Installing service worker ...', e);
    e.waitUntil(
        caches.open(CACHE_STATIC_NAME).then(cache => {
            console.log('[Service Worker] Precaching App Shell');
            cache.addAll([
                '/',
                '/index.html',
                '/src/js/app.js',
                '/src/js/feed.js',
                '/src/js/promise.js',
                '/src/js/fetch.js',
                '/src/js/material.min.js',
                '/src/css/app.css',
                '/src/css/feed.css',
                '/src/images/main-image.jpg',
                'https://fonts.googleapis.com/css?family=Roboto:400,700',
                'https://fonts.googleapis.com/icon?family=Material+Icons',
                'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
            ])
        })
    );
});

self.addEventListener('activate', e => {
    console.log('[Service Worker] Activating service worker ...', e);
    e.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(keyList.map(key => {
                if(key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim(); // be more sure that activation will succeed!
});

self.addEventListener('fetch', e => {
    // console.log('[Service Worker] Fetching something ...', e);
    e.respondWith(
        caches.match(e.request).then(res => {
            if(res) {
                return res;
            } else {
                return fetch(e.request).then(response => {
                    return caches.open(CACHE_DYNAMIC_NAME).then(cache => {
                        cache.put(e.request.url, response.clone());
                        return response;
                    })
                })
            }
        })
    );
});