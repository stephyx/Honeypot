// todo: 'install' event is for old caches deletion. use it?
// todo: split filesToCache in two arrays for easy configuration and merge them
// todo: use typescript. referernces:
// https://github.com/DefinitelyTyped/DefinitelyTyped/tree/HEAD/service_worker_api

var cacheName = 'epwa';

var filesToCache = [

   // infrastructure files ----------------------------------------------------------------------------------------------
   'index.html',
   'sw.js',
   'manifest.json',
   'favicon.ico',
   //--------------------------------------------------------------------------------------------------------------------

   // app files ---------------------------------------------------------------------------------------------------------
   'profile.html',
   'shop.html',
   'info.html',
   'chat.html',
   'hive.html',
   'css/index.css',
   'css/shop.css',
   'css/info.css',
   'css/hive.css',
   'css/chat.css',
   'css/variables.css',
   'css/styles.css',
   'css/popup.css',
   'css/leaderboard-popup.css',
   'css/donate-popup.css',
   'css/profile.css',
   'js/donate-popup.js',
   'img/profile-pic.png',
   'img/offline-img.png',
   'https://fonts.googleapis.com/css?family=Raleway',
   'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'
   // -------------------------------------------------------------------------------------------------------------------
];

// todo: check if service worker is installed before
if ('serviceWorker' in navigator) {
   navigator.serviceWorker.register('sw.js').then(function() {
      console.log('sw: registration ok');
   }).catch(function(err) {
      console.error(err);
   });
}
// ---------------------------------------------------------------------------------------------------------------------
/**
 * 'Install' event. Writing files to browser cache
 *
 * @param {string} Event name ('install')
 * @param {function} Callback function with event data
 *
 */
self.addEventListener('install', function(event) {
   event.waitUntil(
      caches.open(cacheName).then(function(cache) {
         console.log('sw: writing files into cache');
         return cache.addAll(filesToCache);
      })
   )
});
// ---------------------------------------------------------------------------------------------------------------------
/**
 * 'Activate' event. Service worker is activated
 *
 * @param {string} Event name ('activate')
 * @param {function} Callback function with event data
 *
 */
self.addEventListener('activate', function (event) {
   console.log('sw: service worker ready and activated', event);
});
// ---------------------------------------------------------------------------------------------------------------------
/**
 * 'Fetch' event. Browser tries to get resources making a request
 *
 * @param {string} Event name ('fetch')
 * @param {function} Callback function with event data
 *
 */
self.addEventListener('fetch', function(event) {
   event.respondWith(
      // test if the request is cached
      caches.match(event.request).then(function(response) {
         // 1) if response cached, it will be returned from browser cache
         // 2) if response not cached, fetch resource from network
         return response || fetch(event.request);
      }).catch(function (err) {
         // if response not cached and network not available an error is thrown => return fallback image
         return caches.match('img/offline-img.png');
      })
   )
});
// ---------------------------------------------------------------------------------------------------------------------
