// TODO move this file to ../src/ and update browserify to put this in place

self.addEventListener('activate', function(event) {
	console.log('Activated', event)
})

self.addEventListener('install', function(e) {
	self.skipWaiting()

  e.waitUntil(
    caches.open('waybot-web').then(function(cache) {
      console.log('cache opened', cache)
      return cache.addAll([
        '/',
        '/index.html',
        //'/?homescreen=1',
        //'/index.html?homescreen=1',
        '/tufte.css',
        '/bundle.js',
        '/manifest.json',
        '/images/pi.jpg',
        '/images/1-counter.jpg',
        '/images/icon-144x144.png',
        '/images/icon-192x192.png',
        '/images/icon-256x256.png',
        '/images/icon-384x384.png',
        '/images/icon-512x512.png',
        '/images/touch-icon-ipad-retina.png',
        '/images/touch-icon-ipad.png',
        '/images/touch-icon-iphone-retina.png',
        '/images/touch-icon-iphone.png',
        '/et-book/et-book-roman-line-figures/et-book-roman-line-figures.woff',
        '/et-book/et-book-display-italic-old-style-figures/et-book-display-italic-old-style-figures.woff'
      ])
    })
  )
})

self.addEventListener('fetch', function(event) {
  //console.log('fetch event', event.request.url)
  event.respondWith(
    caches.match(event.request).then(function(response) {
      //console.log('SW response', response ? response : 'response is undefined?!')
      return response || fetch(event.request)
    })
 )
})
