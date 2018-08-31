self.addEventListener('install', function (event) {
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

      const title = album['albumName'];
      const options = {
        body: `Composer: ${album.musicDirector}`,
        icon: album['movieIconUrl'],
        badge: album['movieIconUrl'],
        image: album['movieIconUrl'],
        silent: true,
        actions: [
          {
            action: album['movieUrl'],
            title: 'Stream',
            icon: null,
          },
          {
            action: album['movieUrl'],
            title: 'Download Hq',
            icon: null,
          },
          {
            action: album['movieUrl'],
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
    // Take to Home Page
    return;
  }
  
  clients.openWindow(event.action)
});

self.addEventListener('notificationclose', function (_event) {
  // Analytics if needed
});
