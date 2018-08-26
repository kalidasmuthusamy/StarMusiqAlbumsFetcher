self.addEventListener('install', function (event) {
  // TODO: Callbacks after service worker installed
  
});


self.addEventListener('push', function (event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const title = 'Push StarMusiq';
  const options = {
    body: 'Yay it works, Dass!',
    icon: null,
    badge: null
  };

  event.waitUntil(self.registration.showNotification(title, options));
});


self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  event.waitUntil(
    // clients.openWindow('https://developers.google.com/web/')
  );
});
