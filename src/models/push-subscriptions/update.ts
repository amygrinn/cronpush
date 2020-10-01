import * as db from '../db';
import PushSubscription from './push-subscription';

export default async (pushSubscription: PushSubscription) => {
  await db.query(
    `
      UPDATE push_subscriptions
      SET
        ${pushSubscription.userId ? 'userId = :userId,' : ''}
        enabled = :enabled,
        timeZone = :timeZone,
        p256dh = :p256dh,
        auth = :auth
      WHERE
        endpoint = :endpoint
    `,
    {
      endpoint: pushSubscription.endpoint,
      userId: pushSubscription.userId as string,
      enabled: Number(pushSubscription.enabled),
      timeZone: pushSubscription.timeZone,
      p256dh: pushSubscription.keys.p256dh,
      auth: pushSubscription.keys.auth,
    }
  );
};
