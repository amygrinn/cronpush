self.addEventListener('push', event => {
  notification = JSON.parse(event.data.text())
  event.waitUntil(
    self.registration.showNotification(notification.title, notification)
  )
})

self.addEventListener('notificationClick', event => {
  event.notification.close()

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((windowClients) => {
      let matchingClient = null
    
      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i]
        if (windowClient.url === urlToOpen) {
          matchingClient = windowClient
          break
        }
      }
    
      if (matchingClient) {
        return matchingClient.focus()
      } else {
        return clients.openWindow('/')
      }
    })
  )
})
