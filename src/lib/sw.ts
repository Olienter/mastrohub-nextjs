// Service Worker pre caching a offline support
self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open('blog-cache-v1').then((cache) => {
      return cache.addAll([
        '/blog',
        '/static/styles.css',
        '/static/scripts.js'
      ]);
    })
  );
}); 