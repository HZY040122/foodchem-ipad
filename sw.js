/* 食品化学复习站 · iPad 离线缓存
   第一次联网打开时，把下面列出的文件全部存到 iPad 上；之后无论有没有网络，都直接从 iPad 上读取。
   以后更新：替换文件后，iPad 下次联网打开时会自动下载新版本（再打开一次即生效）。 */
const VERSION = 'fc-6bc1148bab';
const FILES = ["./", "index.html", "app.js", "diagrams.js", "data/bank.js", "data/meta.js", "manifest.webmanifest", "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png"];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => {
      if (hit) return hit;
      if (req.mode === 'navigate') return caches.match('index.html');
      return fetch(req);
    }).catch(() => caches.match('index.html'))
  );
});
