/* Service worker: el juego entero queda guardado para jugar sin internet.
   Al publicar cambios, subí VERSION para que los jugadores reciban la versión nueva. */
const VERSION = 'ar-sim-v7';
const CORE = [
  './', './index.html', './manifest.webmanifest', './css/game.css', './css/fonts.css',
  './fonts/barlow-400.woff2', './fonts/barlow-500.woff2', './fonts/barlow-600.woff2', './fonts/barlow-700.woff2', './fonts/barlow-semi-condensed-500.woff2', './fonts/barlow-semi-condensed-600.woff2', './fonts/barlow-semi-condensed-700.woff2',
  './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png',
  './js/engine.js',
  './js/data/parties.js', './js/data/groups.js', './js/data/scenario.js', './js/data/history.js',
  './js/data/policies_a.js', './js/data/policies_b.js', './js/data/policies_c.js', './js/data/policies_d.js', './js/data/policies_e.js',
  './js/data/events.js', './js/data/events_b.js', './js/data/sc_2015.js', './js/data/sc_2002.js', './js/data/sc_1989.js',
  './js/ui/icons.js', './js/ui/art.js', './js/ui/audio.js', './js/ui/ach.js', './js/ui/game.js', './js/ui/flows.js', './js/ui/extras.js', './js/ui/pwa.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION && k.startsWith('ar-sim-')).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Tipografías de Google: se guardan la primera vez y después se sirven sin conexión
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open(VERSION + '-fonts').then(async c => {
      const hit = await c.match(req);
      const net = fetch(req).then(r => { if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    }));
    return;
  }
  if (url.origin !== self.location.origin) return;
  // Archivos del juego: primero la copia guardada, en segundo plano se actualiza
  e.respondWith(caches.open(VERSION).then(async c => {
    const hit = await c.match(req, { ignoreSearch: true });
    const net = fetch(req).then(r => { if (r.ok) c.put(req, r.clone()); return r; }).catch(() => null);
    if (hit) { e.waitUntil(net); return hit; }
    const r = await net;
    if (r) return r;
    if (req.mode === 'navigate') return c.match('./index.html');
    return new Response('', { status: 504 });
  }));
});
