const CACHE = 'koeln50969-v1';
const STATIC = ['/', '/style.css', '/menu.js', '/i18n.js', '/sticker-hero.jpg', '/manifest.json'];

// Install: statische Dateien cachen
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC).catch(() => {})));
  self.skipWaiting();
});

// Activate: alten Cache löschen
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

// Fetch: Cache-first für statische Assets, Network-first für API
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.pathname.startsWith('/api/')) {
    // API immer vom Netz
    e.respondWith(fetch(e.request).catch(() => new Response('{"error":"offline"}', {headers:{'content-type':'application/json'}})));
    return;
  }
  // Statische Dateien: Cache-first
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      if (res.ok && e.request.method === 'GET') {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return res;
    }))
  );
});

// Push-Benachrichtigungen empfangen
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  const title = data.title || 'Köln 50969';
  const body  = data.body  || 'Neuer Fund!';
  const icon  = data.icon  || '/sticker-hero.jpg';
  const url   = data.url   || '/admin.html';
  e.waitUntil(
    self.registration.showNotification(title, {
      body, icon,
      badge: icon,
      data: { url },
      vibrate: [200, 100, 200],
    })
  );
});

// Benachrichtigung antippen → Seite öffnen
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data?.url || '/';
  e.waitUntil(clients.openWindow(url));
});
