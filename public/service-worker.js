console.log('Hello from your service worker');

const CACHE_NAME = "static-cache-v2";
const RUNTIME = 'runtime';

const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/index.js',
    '/styles.css',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/manifest.webmanifest'
    // "/dist/bundle.js",
    // "/dist/manifest.webmanifest"
  ];

  // INSTALL
  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches
        .open(CACHE_NAME)
        .then(cache => {
            console.log("Your files were pre-cached successfully!");
            return cache.addAll(FILES_TO_CACHE)
        })
    )
       self.skipwaiting()
  });

