import webPush from 'web-push'

import { Notifications, ScheduleSubscriptions, Schedules, PushSubscriptions } from '~/models'
import { dateToMySQL } from '~/util'

webPush.setVapidDetails(
  'mailto:tyler@tygr.info',
  process.env.VUE_APP_VAPID_PUBLIC_KEY as string,
  process.env.VAPID_PRIVATE_KEY as string,
)

export default async (now: Date) => {
  const notifications = await Notifications.findAll({
    include: [
      {
        model: ScheduleSubscriptions,
        as: 'scheduleSubscription',
        where: { enabled: true },
        include: [
          Schedules,
          {
            model: PushSubscriptions,
            as: 'pushSubscription',
            where: { enabled: true }
          }
        ]
      },
    ],
    where: {
      sent: false,
      date: dateToMySQL(now)
    }
  })

  await Promise.all(notifications.map(async notification => {
    const pushSubscription = notification.scheduleSubscription!.pushSubscription!
    const schedule = notification.scheduleSubscription!.schedule!

    const pushSubscriptionObject = {
      endpoint: pushSubscription.endpoint,
      keys: {
        auth: pushSubscription.auth,
        p256dh: pushSubscription.p256dh,
      },
    }

    const payload = {
      title: schedule.title,
      body: schedule.message,
      icon: schedule.icon,
      badge: schedule.icon,
    }

    await webPush.sendNotification(pushSubscriptionObject, JSON.stringify(payload))
    notification.update({ sent: true })
  }))
}
