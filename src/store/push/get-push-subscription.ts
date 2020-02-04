class UnsupportedError extends Error {
  constructor() {
    super('Push notifications are not supported')
  }
}

class NotRegisteredError extends Error {
  constructor() {
    super('Service worker is not registered')
  }
}

class NotPermittedError extends Error {
  constructor() {
    super('Push notifications not allowed by user')
  }
}

class CreationError extends Error {
  constructor() {
    super('Failed to create push subscription')
  }
}

/**
 *
 * Gets an existing push subscription or creates a new one
 *
 * @param createIfNotExists If true, ask for permission for push notifications if it does not exist and create a subscription if it does not exist
 * @returns {Promise<PushSubscription | null>}
 * @throws {UnsupportedError}
 * @throws {NotRegisteredError}
 * @throws {NotPermittedError}
 * @throws {CreationError}
 */
export default async (createIfNotExists: boolean) => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    throw new UnsupportedError()
  }

  const registration = await navigator.serviceWorker.getRegistration()

  if (!registration) {
    throw new NotRegisteredError()
  }

  let permitted = Notification.permission === 'granted'
  if (createIfNotExists && !permitted) {
    permitted = (await Notification.requestPermission()) === 'granted'
  }

  if (!permitted) {
    throw new NotPermittedError()
  }

  let subscription = await registration.pushManager.getSubscription()
  if (createIfNotExists && !subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.VUE_APP_VAPID_PUBLIC_KEY,
    })

    if (!subscription) {
      throw new CreationError()
    }
  }

  return subscription
}
