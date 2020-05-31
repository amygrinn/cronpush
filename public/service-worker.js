self.addEventListener('push', event => {
  notification = JSON.parse(event.data.text())
  event.waitUntil(
    self.registration.showNotification(notification.title, notification)
  )
})

self.addEventListener('notificationclick', event => {
  event.notification.close()

  if (event.action !== 'dismiss') {
    return event.waitUntil(
      clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      }).then((windowClients) => {
        if (windowClients.length > 0) {
          return windowClients[0].focus()
        } else {
          return clients.openWindow('/')
        }
      })
    )
  }
})
