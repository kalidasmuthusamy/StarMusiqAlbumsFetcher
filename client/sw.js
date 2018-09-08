importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js');

self.addEventListener('install', function (_event) {
  // TODO: Callbacks after service worker installed

  if (workbox) {
    console.log('Yay! Workbox is loaded 🎉');
  } else {
    console.log('Boo! Workbox didn\'t load 😬');
  }
});

const router = new workbox.routing.Router();

const serviceWorkerModuleStrategy = workbox.strategies.networkFirst({
  cacheName: 'sw',
  plugins: [
    new workbox.backgroundSync.Plugin(
      new workbox.backgroundSync.Queue({ name: 'sw-js' })
    )
  ],
});

const albumContentFetchEndpointStrategy = workbox.strategies.networkFirst({
  cacheName: 'cors-new-tamil-albums',
  plugins: [
    new workbox.backgroundSync.Plugin(
      new workbox.backgroundSync.Queue({ name: 'cors-new-tamil-albums-q' })
    )
  ],
});

const thirdPartyLibrariesStrategy = workbox.strategies.cacheFirst({
  cacheName: 'third-party-assets',
  plugins: [
    new workbox.backgroundSync.Plugin(
      new workbox.backgroundSync.Queue({ name: 'third-party-assets-q' })
    ),
    new workbox.expiration.Plugin({
      maxAgeSeconds: 604800, // 7 days in seconds
    }),
  ],
});

const thirdPartyLibrariesRequestMatchHandler = ({ url, _event }) => (
  [
    'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.3/umd/popper.min.js',
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.4.3/css/mdb.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
    'https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js',
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/js/bootstrap.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.4.3/js/mdb.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.4.3/font/roboto/Roboto-Regular.woff2',
    'https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.4.3/font/roboto/Roboto-Bold.woff2',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.woff2?v=4.7.0'
  ].includes(url.href)
);

const albumImagesStrategy = workbox.strategies.cacheFirst({
  cacheName: 'album-images',
  plugins: [
    new workbox.backgroundSync.Plugin(
      new workbox.backgroundSync.Queue({ name: 'album-images' })
    ),
    new workbox.expiration.Plugin({
      maxAgeSeconds: 604800, // 7 days in seconds
      maxEntries: 100,
    }),
  ],
});

const fallbackRouteMatchHandler = ({ _url, _event }) => (true);
const fallbackRouteStrategy = workbox.strategies.networkFirst({
  cacheName: 'fallback-routes',
  plugins: [
    new workbox.backgroundSync.Plugin(
      new workbox.backgroundSync.Queue({ name: 'fallback-routes' })
    )
  ],
});

router.registerRoute(new workbox.routing.RegExpRoute(
  new RegExp('/*/bundle.js'),
  serviceWorkerModuleStrategy
));

router.registerRoute(new workbox.routing.RegExpRoute(
  new RegExp('/sw/index.js'),
  serviceWorkerModuleStrategy
));

router.registerRoute(new workbox.routing.RegExpRoute(
  new RegExp('https://cors-dass.herokuapp.com/*'),
  albumContentFetchEndpointStrategy
));

router.registerRoute(new workbox.routing.Route(
  thirdPartyLibrariesRequestMatchHandler,
  thirdPartyLibrariesStrategy
));

router.registerRoute(new workbox.routing.RegExpRoute(
  new RegExp('https://www.sunmusiq.com/movieimages/*'),
  albumImagesStrategy
));

router.registerRoute(new workbox.routing.Route(
  fallbackRouteMatchHandler,
  fallbackRouteStrategy
));

self.addEventListener('fetch', (event) => {
  const responsePromise = router.handleRequest(event);
  if (responsePromise) {
    // Router found a route to handle the request
    event.respondWith(responsePromise);
  } else {
    // No route found to handle the request
  }
});

function isClientFocused() {
  return clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  })
    .then((windowClients) => {
      let clientIsFocused = false;

      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        if (windowClient.focused) {
          clientIsFocused = true;
          break;
        }
      }

      return clientIsFocused;
    });
}


self.addEventListener('push', function (event) {
  const displayNotificationPromiseChain = isClientFocused()
    .then((clientIsFocused) => {
      if (clientIsFocused) {
        return;
      }

      const album = JSON.parse(event.data.text());
      const albumIconUrl = album['movieIconUrl'];

      const title = album['albumName'];
      const options = {
        body: `${album.musicDirector}`,
        icon: albumIconUrl,
        badge: albumIconUrl,
        image: albumIconUrl,
        silent: true,
        actions: [
          {
            action: album['movieUrl'],
            title: 'Stream',
            icon: null,
          },
          {
            action: album['downloadLinkHq'],
            title: 'Download',
            icon: null,
          },
          {
            action: album['downloadLinkNormal'],
            title: 'Download Normal',
            icon: null,
          }
        ]
      };
      // Client isn't focused, we need to show a notification.
      return self.registration.showNotification(title, options);
    });

  event.waitUntil(displayNotificationPromiseChain);
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  if (!event.action) {
    event.waitUntil(
      clients.openWindow('/')
    );
  } else {
    event.waitUntil(
      clients.openWindow(event.action)
    );
  }
});

self.addEventListener('notificationclose', function (_event) {
  // Analytics if needed
});
