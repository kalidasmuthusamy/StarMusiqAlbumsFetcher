const applicationServerPublicKey = '< webpush Vapid.publicKey>';
let swReg = null;

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);

  swReg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  }).then(function (sub) {
    console.log(sub);
    console.log('Endpoint URL: ', sub.endpoint);
  }).catch(function (e) {
    if (Notification.permission === 'denied') {
      console.warn('Permission for notifications was denied');
    } else {
      console.error('Unable to subscribe to push', e);
    }
  });
}


if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw-test/sw.js').then(function (reg) {
    swReg = reg;

    if (reg.installing) {
      console.log('Service worker installing');
    } else if (reg.waiting) {
      console.log('Service worker installed');
    } else if (reg.active) {
      console.log('Service worker active');
    }

    reg.pushManager.getSubscription().then(function (sub) {
      if (sub === null) {

        Notification.requestPermission().then(function (status) {
          console.log('Notification permission status:', status);
          subscribeUser();
        });

      } else {
        // We have a subscription, update the database
        console.log('Subscription object: ', sub);
        console.log('Subscription object: ', JSON.stringify(sub));
      }
    });

  }).catch(function (error) {
    // registration failed
    console.log('Registration failed with ' + error);
  });

}


// const webpush = require('web-push');

// // VAPID keys should only be generated only once.
// const vapidKeys = webpush.generateVAPIDKeys();

// webpush.setGCMAPIKey('firebase project server key');

// webpush.setVapidDetails(
//   'mailto:localhost:3000',
//   vapidKeys.publicKey,
//   vapidKeys.privateKey
// );

// webpush.sendNotification(pushSubscription, 'Your Push Payload Text');
