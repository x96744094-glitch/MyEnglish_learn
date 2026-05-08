// Service Worker for 英文學習平台 PWA
const CACHE_NAME = 'english-learn-v1';
const STATIC_CACHE = 'english-learn-static-v1';

// 靜態資源 - 離線也能使用
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/vocabulary',
  '/dictionary',
  '/grammar',
  '/phrases',
  '/notebook',
];

// ===== 安裝 Service Worker =====
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Some assets failed to cache:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// ===== 啟動 =====
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== STATIC_CACHE)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// ===== 攔截請求 =====
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API 請求 → Network First（先嘗試網路，失敗才用快取）
  if (url.pathname.startsWith('/api') || url.hostname.includes('railway.app')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // HTML 頁面 → Network First（確保最新版本）
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // 靜態資源 (JS, CSS, 圖片) → Cache First（先用快取，快又省流量）
  event.respondWith(cacheFirst(request));
});

// ===== 策略：Network First =====
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || new Response(
      JSON.stringify({ error: '離線中，請連接網路後重試' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// ===== 策略：Cache First =====
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('', { status: 404 });
  }
}

// ===== 背景同步（推播通知預留） =====
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
