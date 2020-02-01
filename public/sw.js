const CACHE_STATIC_NAME = 'static-v9';
const CACHE_DYNAMIC_NAME = 'dynamic-v2';
const STATIC_FILES = [
    '/',
    '/index.html',
    '/offline.html',
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
];

self.addEventListener('install', e => {
    console.log('[Service Worker] Installing service worker ...', e);
    e.waitUntil(
        caches.open(CACHE_STATIC_NAME).then(cache => {
            console.log('[Service Worker] Precaching App Shell');
            cache.addAll(STATIC_FILES)
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

// self.addEventListener('fetch', e => {
//     // console.log('[Service Worker] Fetching something ...', e);
//     e.respondWith(
//         caches.match(e.request).then(res => {
//             if(res) {
//                 return res; // if cache return it
//             } else {
//                 return fetch(e.request).then(response => { // if no cache try to make request and cache it
//                     return caches.open(CACHE_DYNAMIC_NAME).then(cache => {
//                         cache.put(e.request.url, response.clone());
//                         return response;
//                     })
//                 }).catch(err => { // if no network and no cache
//                     return caches.open(CACHE_STATIC_NAME).then(cache => { // Provide fallback
//                         return cache.match('/offline.html')
//                     })
//                 });
//             }
//         })
//     );
// });

const isInArray = (string, array) => {
  for(let i = 0; i < array.length; i++) {
      if(array[i] === string) {
          return true;
      }
  }
  return false;
};

/* Cache then Network */
self.addEventListener('fetch', e => {
    var url = 'https://httpbin.org/get';

    if(e.request.url.indexOf(url) > -1) {
        e.respondWith(
            caches.open(CACHE_DYNAMIC_NAME).then(cache => {
                return fetch(e.request).then(res => {
                    cache.put(e.request, res.clone());
                    return res;
                })
            })
        )
    } else if(isInArray(e.request.url, STATIC_FILES)) {
        e.respondWith(
            caches.match(e.request)
        )
    } else {
        e.respondWith(
            caches.match(e.request).then(res => {
                if(res) {
                    return res; // if cache return it
                } else {
                    return fetch(e.request).then(response => { // if no cache try to make request and cache it
                        return caches.open(CACHE_DYNAMIC_NAME).then(cache => {
                            cache.put(e.request.url, response.clone());
                            return response;
                        })
                    }).catch(err => { // if no network and no cache
                        return caches.open(CACHE_STATIC_NAME).then(cache => { // Provide fallback
                            if(e.request.headers.get('accept').includes('text/html')) { // Do fallback only for html 
                                return cache.match('/offline.html')
                            }
                        })
                    });
                }
            })

        );
    }
});

/* Cache-only */
// self.addEventListener('fetch', e => {
//     e.respondWith(
//         caches.match(e.request)
//     );
// });

/* Network-only */
// self.addEventListener('fetch', e => {
//     e.respondWith(
//         fetch(e.request)
//     );
// });

/* Network first with dynamic caching and Cache Fallback */
// self.addEventListener('fetch', e => {
//     e.respondWith(
//         fetch(e.request).then(response => {
//             return caches.open(CACHE_DYNAMIC_NAME).then(cache => {
//                 cache.put(e.request.url, response.clone());
//                 return response;
//             })
//         }).catch(err => {
//             caches.match(e.request)
//         })
//     );
// });