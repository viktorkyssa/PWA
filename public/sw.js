self.addEventListener('install', e => {
    console.log('[Service Worker] Installing service worker ...', e);
});

self.addEventListener('activate', e => {
    console.log('[Service Worker] Activating service worker ...', e);
    return self.clients.claim(); // be more sure that activation will succeed!
});

self.addEventListener('fetch', e => {
    console.log('[Service Worker] Fetching something ...', e);
    e.respondWith(fetch(e.request));
});