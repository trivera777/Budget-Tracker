// register
// install
// activate
// fetch

const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

const FILES_TO_CACHE = [
    '/',
    '/db.js',
    '/index.html',
    '/index.js',
    '/styles.css',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/manifest.json',
    'service-worker.js'
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
    self.skipWaiting();
  });

// activate 
self.addEventListener('activate', (event) => {
    console.log('activated');
    event.waitUntil(
       caches.keys()
       .then((keyList) => {
           return Promise.all(keyList.map((key) => {
               if(key !== CACHE_NAME){
                   console.log('working',key);
                   return caches.delete(key)
               }
           }))
       })
    )
    self.clients.claim();
})

self.addEventListener('fetch', (event) => {
  if(event.request.url.includes('/api')){
    console.log('fetching...');
    event.respondWith(
      caches.open(DATA_CACHE_NAME)
      .then(cache => {
        return fetch(event.request)
        .then(response => {
          if(response.status === 200){
            cache.put(event.request.url, response.clone())
          }
          return response;
        })
        .catch(error => {
          return cache.match(event.request)
        })
      }).catch(error => console.log(error))
    )
    return
  }

  event.respondWith(
    fetch(event.request)
    .catch(function() {
      return caches.match(event.request)
      .then((response) => {
        if(response){
          return response
        } else if (event.request.headers.get('accept').includes('text/html')){
          return caches.match('/')
        }
      })
    })
  )
})
