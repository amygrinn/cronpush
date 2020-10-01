import * as db from '../db';
import PushSubscription from './push-subscription';

export default async (
  endpoint: string
): Promise<PushSubscription | undefined> => {
  const [rawPushSubscription] = await db.query(
    `
      SELECT userId, enabled, endpoint, p256dh, auth, timeZone
      FROM push_subscriptions
      WHERE endpoint = :endpoint
    `,
    { endpoint }
  );

  if (rawPushSubscription) {
    return {
      userId: rawPushSubscription.userId as string,
      enabled: !!rawPushSubscription.enabled,
      endpoint: rawPushSubscription.endpoint as string,
      keys: {
        p256dh: rawPushSubscription.p256dh as string,
        auth: rawPushSubscription.auth as string,
      },
      timeZone: rawPushSubscription.timeZone as string,
    };
  }

  return undefined;
};
