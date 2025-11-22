import { APP_VERSION } from "../src/constants/version";

// 캐시 버전 관리용 상수 추가
const CACHE_NAME = `campus-table-${APP_VERSION}`; // [CHANGED]

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
          // 이전 버전 캐시는 정리
          // 예: campus-table-v1, campus-table-v0 등
          if (cacheName.startsWith('campus-table-') && cacheName !== CACHE_NAME) { // [CHANGED]
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

// Fetch 이벤트 (네트워크 요청 처리)
self.addEventListener('fetch', (event) => {
  // GET 요청만 캐시
  if (event.request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(event.request.url);

  // 1) HTML 문서(페이지) 요청: 네트워크 우선 + 캐시 폴백 [CHANGED]
  // - mode === 'navigate' : 브라우저가 페이지 네비게이션용으로 요청하는 경우
  // - destination === 'document' : 문서 리소스 (SSR 페이지 등)
  if (
    event.request.mode === 'navigate' ||
    (event.request.destination === 'document' && requestUrl.origin === self.location.origin)
  ) {
    event.respondWith(
      fetch(event.request)
      .then((response) => {
        // 성공하면 최신 HTML을 캐시에 갱신
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        // 네트워크 실패 시, 캐시된 페이지 또는 루트("/")로 폴백
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return caches.match('/');
        });
      })
    );
    return;
  }

  // 2) API 요청: 네트워크 우선 (기존 로직 유지, 약간 리팩토링) [CHANGED]
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

  // 3) 그 외 정적 리소스: 캐시 우선 (기존 정책 유지)
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
      // 오프라인 시 기본 페이지 반환 (문서 요청이지만 위에서 걸러지지 않은 경우 대비)
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
