import * as db from '../db';
import createId from '../util/create-id';
import PushSubscription from './push-subscription';

export default async (pushSubscription: PushSubscription) => {
  const id = createId();

  await db.query(
    `
      INSERT INTO push_subscriptions (
        id, userId, enabled, endpoint, p256dh, auth, timeZone
      ) VALUES (
        :id, :userId, :enabled, :endpoint, :p256dh, :auth, :timeZone
      )
    `,
    {
      id,
      userId: pushSubscription.userId || '',
      enabled: Number(pushSubscription.enabled),
      endpoint: pushSubscription.endpoint,
      p256dh: pushSubscription.keys.p256dh,
      auth: pushSubscription.keys.auth,
      timeZone: pushSubscription.timeZone,
    }
  );
};
