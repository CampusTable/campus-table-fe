const CACHE_NAME = 'campus-table';
const STATIC_CACHE_URLS = [
  '/',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/manifest.webmanifest'
];

// 설치 이벤트
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
    .then((cache) => {
      console.log('Service Worker: Caching files');
      return cache.addAll(STATIC_CACHE_URLS);
    })
    .then(() => {
      console.log('Service Worker: Installed');
      return self.skipWaiting();
    })
  );
});

// 활성화 이벤트
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
        })
      );
    })
    .then(() => {
      console.log('Service Worker: Activated');
      return self.clients.claim();
    })
  );
});

// Fetch 이벤트 (네트워크 요청 처리)
self.addEventListener('fetch', (event) => {
  // GET 요청만 캐시
  if (event.request.method !== 'GET') {
    return;
  }

  // API 요청은 네트워크 우선
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
      .catch(() => {
        return new Response(
          JSON.stringify({ error: 'Network error' }),
          {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'application/json'
            })
          }
        );
      })
    );
    return;
  }

  // 정적 리소스는 캐시 우선
  event.respondWith(
    caches.match(event.request)
    .then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
      .then((response) => {
        // 유효한 응답인지 확인
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // 응답 복사본을 캐시에 저장
        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
        .then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
    .catch(() => {
      // 오프라인 시 기본 페이지 반환
      if (event.request.destination === 'document') {
        return caches.match('/');
      }
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