import * as db from '../db';
import createId from '../util/create-id';
import ScheduleSubscription from './schedule-subscription';

export default (
  endpoint: string,
  scheduleId: string,
  enabled: boolean
): Promise<ScheduleSubscription> =>
  db.useConnection(async (query) => {
    const [
      { pushSubscriptionId },
    ] = (await db.query(
      `SELECT id AS pushSubscriptionId FROM push_subscriptions WHERE endpoint = :endpoint`,
      { endpoint }
    )) as [{ pushSubscriptionId: string }];

    if (!pushSubscriptionId) {
      throw new Error('Push subscription does not exist');
    }

    const scheduleSubscription: ScheduleSubscription = {
      id: createId(),
      endpoint,
      scheduleId,
      enabled,
      pushSubscriptionId,
    };

    db.query(
      `
      INSERT INTO schedule_subscriptions (
        pushSubscriptionId,
        id, scheduleId, enabled
      ) VALUES (
        (SELECT id FROM push_subscriptions WHERE endpoint = :endpoint),
        :id, :scheduleId, :enabled
      )
    `,
      {
        ...scheduleSubscription,
        enabled: Number(scheduleSubscription.enabled),
      }
    );

    return scheduleSubscription;
  });
