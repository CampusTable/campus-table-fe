const CACHE_NAME = 'campus-table';
const STATIC_CACHE_URLS = [
  '/',
  '/icons/icon-192x192.png',
  '/icons/icon-256x256.png',
  '/icons/icon-512x512.png',
  '/icons/icon-2048x2048.png',
  '/icons/badge-72x72.png',
  '/icons/action-close.png',
  '/icons/action-open.png',
  '/manifest.webmanifest'
];

// 설치 이벤트: 정적 리소스만 사전 캐시 (오프라인 폴백용)
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
    .then((cache) => {
      console.log('Service Worker: Caching static files');
      return cache.addAll(STATIC_CACHE_URLS);
    })
    .then(() => {
      console.log('Service Worker: Installed');
      return self.skipWaiting();
    })
  );
});

// 활성화 이벤트: 이전 캐시 정리
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');

  event.waitUntil(
    caches.keys()
    .then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
          return undefined;
        })
      );
    })
    .then(() => {
      console.log('Service Worker: Activated');
      return self.clients.claim();
    })
  );
});

// Fetch 이벤트
self.addEventListener('fetch', (event) => {
  // GET 요청만 처리
  if (event.request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(event.request.url);

  // 1) API 요청: 네트워크 우선, 캐시는 사용하지 않음
  if (requestUrl.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({ error: 'Network error' }),
          {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'application/json',
            }),
          }
        );
      })
    );
    return;
  }

  // 2) 그 외 모든 GET 요청: 네트워크 우선, 실패 시에만 캐시 폴백
  event.respondWith(
    fetch(event.request)
    .then((response) => {
      // ✅ 개발 단계: 여기서 더 이상 cache.put 하지 않음
      // 항상 네트워크 응답을 그대로 반환
      return response;
    })
    .catch(() => {
      // 네트워크 실패(오프라인 등) 시 캐시에서 찾아보기
      return caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        // 문서 요청인데 캐시에 없으면 "/" 로 폴백
        if (event.request.destination === 'document') {
          return caches.match('/');
        }

        // 그 외는 그냥 undefined 반환 (브라우저 기본 에러 화면)
        return undefined;
      });
    })
  );
});

// Push 알림 (향후 확장용)
self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: data.data || {},
    actions: [
      {
        action: 'open',
        title: '열기',
        icon: '/icons/action-open.png'
      },
      {
        action: 'close',
        title: '닫기',
        icon: '/icons/action-close.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 알림 클릭 처리
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  event.waitUntil(
    self.clients.openWindow('/')
  );
});
