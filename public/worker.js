
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.text() : 'Vous avez une nouvelle notification !';

    const options = {
        body: data,
        icon: '/icon.png',
        badge: '/badge.png',
    };

    event.waitUntil(
        self.registration.showNotification('Notification Push', options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});
