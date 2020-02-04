import createNotifications from './create-notifications'
import sendNotifications from './send-notifications'
import removeFutureNotifications from './remove-future-notifications'

export { removeFutureNotifications }

export default async () => {
  send()

  const nextMinute = new Date()
  nextMinute.setSeconds(60, 0)
  const delay = nextMinute.getTime() - new Date().getTime()

  setTimeout(() => {
    send()
    setInterval(send, 60 * 1000)
  }, delay)
}

const send = async () => {
  const now = new Date()
  now.setSeconds(0, 0)
  await createNotifications(new Date(now.getTime()))
  await sendNotifications(new Date(now.getTime()))
}
