function subscribeUser() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(function (reg) {

      reg.pushManager.subscribe({
        userVisibleOnly: true
      }).then(function (sub) {
        console.log('Endpoint URL: ', sub.endpoint);
      }).catch(function (e) {
        if (Notification.permission === 'denied') {
          console.warn('Permission for notifications was denied');
        } else {
          console.error('Unable to subscribe to push', e);
        }
      });
    })
  }
}


if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw-test/sw.js').then(function (reg) {

    if (reg.installing) {
      console.log('Service worker installing');
    } else if (reg.waiting) {
      console.log('Service worker installed');
    } else if (reg.active) {
      console.log('Service worker active');
    }

    reg.pushManager.getSubscription().then(function (sub) {
      if (sub === null) {

        Notification.requestPermission(function (status) {
          console.log('Notification permission status:', status);
          subscribeUser();
        });

        console.log('Not subscribed to push service!');
      } else {
        // We have a subscription, update the database
        console.log('Subscription object: ', sub);
      }
    });

  }).catch(function (error) {
    // registration failed
    console.log('Registration failed with ' + error);
  });

}
