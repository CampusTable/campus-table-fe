const CACHE_NAME = 'campus-table';

// 오프라인 폴백용으로만 쓸 최소 정적 파일들
const STATIC_CACHE_URLS = [
  '/',
  '/icons/icon-192x192.png',
  '/icons/icon-256x256.png',
  '/icons/icon-512x512.png',
  '/icons/icon-2048x2048.png',
  '/icons/badge-72x72.png',
  '/icons/action-close.png',
  '/icons/action-open.png',
  '/manifest.webmanifest',
];

// 설치 이벤트: 일단 기본 리소스만 살짝 캐시 (오프라인 대비용)
self.addEventListener('install', (event) => {
  console.log('SW: install');

  event.waitUntil(
    caches.open(CACHE_NAME)
    .then((cache) => cache.addAll(STATIC_CACHE_URLS))
    .then(() => self.skipWaiting())
  );
});

// 활성화 이벤트: 🔥 기존 캐시 전부 삭제
self.addEventListener('activate', (event) => {
  console.log('SW: activate');

  event.waitUntil(
    caches.keys()
    .then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          // 이름 상관없이 그냥 싹 다 날려버림 (개발 단계니까 과감하게)
          console.log('SW: delete cache', cacheName);
          return caches.delete(cacheName);
        })
      )
    )
    .then(() => self.clients.claim())
  );
});

// fetch 이벤트: 네트워크 우선, 실패 시에만 캐시 폴백
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(event.request.url);

  // API는 네트워크만 사용 (캐시 X)
  if (requestUrl.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({ error: 'Network error' }),
          {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'application/json' },
          }
        );
      })
    );
    return;
  }

  // 그 외 GET: 네트워크 우선
  event.respondWith(
    fetch(event.request)
    .then((response) => {
      // 개발 단계에서는 여기서 cache.put 안 함
      return response;
    })
    .catch(() => {
      // 오프라인일 때만 캐시 폴백
      return caches.match(event.request).then((cached) => {
        if (cached) {
          return cached;
        }
        // 문서 요청인데 캐시도 없으면 메인으로 폴백
        if (event.request.destination === 'document') {
          return caches.match('/');
        }
        return undefined;
      });
    })
  );
});

// push/notificationclick 코드는 그대로 두어도 됨
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: data.data || {},
    actions: [
      { action: 'open', title: '열기', icon: '/icons/action-open.png' },
      { action: 'close', title: '닫기', icon: '/icons/action-close.png' },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'close') return;

  event.waitUntil(self.clients.openWindow('/'));
});
