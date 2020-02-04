/* eslint-disable no-console */

import { register } from 'register-service-worker'

register(`${process.env.BASE_URL}service-worker.js`, {
  ready() {
    console.log(
      'Notifications are being sent from a service worker.\n' +
        'For more details, visit https://developers.google.com/web/ilt/pwa/introduction-to-service-worker'
    )
  },
  registered() {
    console.log('Service worker has been registered.')
  },
  cached() {
    console.log('Content has been cached for offline use.')
  },
  updatefound() {
    console.log('New content is downloading.')
  },
  updated() {
    console.log('New content is available; please refresh.')
  },
  offline() {
    // console.log('No internet connection found. App is running in offline mode.')
  },
  error(error) {
    console.error('Error during service worker registration:', error)
  },
})
