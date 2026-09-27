// Service Worker para Notificaciones Web Push - San Telmo Almacén de Alimentos (1919)

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let data = {
    title: 'San Telmo Almacén',
    body: 'Novedades y cortes a las brasas en San Telmo.',
    url: '/',
    icon: '/favicon-32x32.png',
    badge: '/favicon-32x32.png'
  };

  if (event.data) {
    try {
      const parsed = event.data.json();
      data = { ...data, ...parsed };
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/favicon-32x32.png',
    badge: data.badge || '/favicon-32x32.png',
    data: {
      url: data.url || '/'
    },
    vibrate: [100, 50, 100],
    actions: [
      { action: 'open', title: 'Ver en San Telmo' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          if (client.url.includes(targetUrl) || targetUrl === '/') {
            return client.focus();
          }
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
