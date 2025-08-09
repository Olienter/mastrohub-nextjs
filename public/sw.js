const CACHE_NAME = 'mastrohub-v1';
const STATIC_CACHE_NAME = 'mastrohub-static-v1';
const DYNAMIC_CACHE_NAME = 'mastrohub-dynamic-v1';

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/api/notifications',
  '/api/ai-assistant',
  '/api/advanced-analytics',
  '/api/supply-chain'
];

const STATIC_RESOURCES = [
  '/_next/static/',
  '/images/',
  '/fonts/'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - handle requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static resources
  if (isStaticResource(url.pathname)) {
    event.respondWith(handleStaticResource(request));
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  // Default: network first, fallback to cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});

// Handle API requests with cache-first strategy
async function handleApiRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.status === 200) {
      // Cache successful responses
      const responseClone = networkResponse.clone();
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, responseClone);
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for API calls
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Offline - No internet connection',
        data: null 
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle static resources with cache-first strategy
async function handleStaticResource(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.status === 200) {
      const responseClone = networkResponse.clone();
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, responseClone);
    }
    return networkResponse;
  } catch (error) {
    return new Response('Resource not available offline', { status: 404 });
  }
}

// Handle navigation requests with network-first strategy
async function handleNavigationRequest(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.status === 200) {
      const responseClone = networkResponse.clone();
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, responseClone);
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page
    return caches.match('/offline');
  }
}

// Check if URL is a static resource
function isStaticResource(pathname) {
  return STATIC_RESOURCES.some(resource => pathname.startsWith(resource));
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Background sync implementation
async function doBackgroundSync() {
  try {
    // Sync pending notifications
    const pendingNotifications = await getPendingNotifications();
    for (const notification of pendingNotifications) {
      await syncNotification(notification);
    }
    
    // Sync pending analytics
    const pendingAnalytics = await getPendingAnalytics();
    for (const analytics of pendingAnalytics) {
      await syncAnalytics(analytics);
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Mock functions for background sync
async function getPendingNotifications() {
  // In a real app, this would read from IndexedDB
  return [];
}

async function syncNotification(notification) {
  // In a real app, this would send to server
  console.log('Syncing notification:', notification);
}

async function getPendingAnalytics() {
  // In a real app, this would read from IndexedDB
  return [];
}

async function syncAnalytics(analytics) {
  // In a real app, this would send to server
  console.log('Syncing analytics:', analytics);
}

// Push notification handling
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from MastroHub',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View',
        icon: '/icons/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-192x192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('MastroHub', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      self.clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      self.clients.openWindow('/')
    );
  }
}); 