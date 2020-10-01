import webPush from 'web-push';
import { notifications, pushSubscriptions } from '../models';

webPush.setGCMAPIKey(process.env.GCM_API_KEY || null);
webPush.setVapidDetails(
  'mailto:tyler@tygr.info',
  process.env.VAPID_PUBLIC_KEY as string,
  process.env.VAPID_PRIVATE_KEY as string
);

export default async (now: Date) =>
  Promise.allSettled(
    (await notifications.find()).map((notification) => {
      const pushSubscription = {
        endpoint: notification.endpoint,
        keys: notification.keys,
      };

      const payload = {
        title: notification.title,
        body: notification.message,
        icon: notification.icon,
        badge: notification.icon,
        tag: notification.id,
        renotify: true,
        requireInteraction: true,
        timestamp: notification.date,
        actions: [
          {
            action: 'edit',
            title: 'Edit',
          },
        ],
      };

      return webPush
        .sendNotification(pushSubscription, JSON.stringify(payload))
        .then(() => {
          notification.sent = true;
          return notifications.update(notification);
        })
        .catch((err) => {
          console.error(err);
          return pushSubscriptions.destroy(notification.endpoint);
        });
    })
  );
