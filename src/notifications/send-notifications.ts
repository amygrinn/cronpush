import webPush from 'web-push';

import {
  Notifications, ScheduleSubscriptions, Schedules, PushSubscriptions,
} from '../models';
import dateToMySQL from '../util';

webPush.setGCMAPIKey(process.env.GCM_API_KEY || null);
webPush.setVapidDetails(
  'mailto:tyler@tygr.info',
  process.env.VAPID_PUBLIC_KEY as string,
  process.env.VAPID_PRIVATE_KEY as string,
);

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
            where: { enabled: true },
          },
        ],
      },
    ],
    where: {
      sent: false,
      date: dateToMySQL(now),
    },
  });

  await Promise.all(notifications.map(async (notification) => {
    const pushSubscription = notification.scheduleSubscription!.pushSubscription!;
    const schedule = notification.scheduleSubscription!.schedule!;

    const pushSubscriptionObject = {
      endpoint: pushSubscription.endpoint,
      keys: {
        auth: pushSubscription.auth,
        p256dh: pushSubscription.p256dh,
      },
    };

    const payload = {
      title: schedule.title,
      body: schedule.message,
      icon: schedule.icon,
      badge: schedule.icon,
      tag: schedule.id,
      renotify: true,
      requireInteraction: true,
      timestamp: notification.date.getTime(),
      actions: [
        {
          action: 'dismiss',
          title: 'Dismiss',
        },
        {
          action: 'edit',
          title: 'Edit',
        },
      ],
    };

    try {
      await webPush.sendNotification(pushSubscriptionObject, JSON.stringify(payload));
      notification.update({ sent: true });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      pushSubscription.destroy();
    }
  }));
};
