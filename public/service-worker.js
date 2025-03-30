// Cache names
const CACHE_NAME = 'wordle6-cache-v1';
const API_CACHE_NAME = 'wordle6-api-cache-v1';

// Files to cache
const CACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  // Skip waiting to activate immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching app shell files');
        return cache.addAll(CACHE_ASSETS);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME;
        }).map(cacheName => {
          console.log('[Service Worker] Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('[Service Worker] Claiming clients...');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network and cache
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Handle API requests separately
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(event.request));
    return;
  }
  
  // For non-API requests, use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // If found in cache, return it
        if (response) {
          return response;
        }
        
        // Otherwise, fetch from network
        return fetch(event.request)
          .then(networkResponse => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            // Clone the response to store in cache and return
            const responseToCache = networkResponse.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
              
            return networkResponse;
          })
          .catch(error => {
            console.log('[Service Worker] Fetch error:', error);
            // Return a fallback offline page if available
            return caches.match('/offline.html');
          });
      })
  );
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  // For API requests, try network first, then fall back to cache
  try {
    // Try to get a fresh response from the network
    const networkResponse = await fetch(request);
    
    // If successful, clone the response to store in cache
    const clonedResponse = networkResponse.clone();
    
    // Store in the API cache
    const cache = await caches.open(API_CACHE_NAME);
    cache.put(request, clonedResponse);
    
    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] API fetch failed, trying cache:', error);
    
    // If network request fails, try to get from cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If no cached version exists, return a custom offline response
    // For API requests, return a default response
    if (request.url.includes('/api/word')) {
      // Provide a fallback word for offline play
      return new Response(
        JSON.stringify({ word: "OFFLINE" }),
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // For validation, assume valid for offline play
    if (request.url.includes('/api/validate')) {
      return new Response(
        JSON.stringify({ valid: true }),
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // For other API endpoints
    return new Response(
      JSON.stringify({ error: 'You are offline' }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}