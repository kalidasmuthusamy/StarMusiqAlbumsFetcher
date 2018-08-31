self.addEventListener('install', function (_event) {
  // TODO: Callbacks after service worker installed
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
        body: `Composer: ${album.musicDirector}`,
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
            title: 'Download Hq',
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
  if (!event.action) {
    clients.openWindow('/');
    return;
  }

  clients.openWindow(event.action);
});

self.addEventListener('notificationclose', function (_event) {
  // Analytics if needed
});
