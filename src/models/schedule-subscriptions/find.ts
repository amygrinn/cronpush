import * as db from '../db';
import ScheduleSubscription from './schedule-subscription';

export default async (
  endpoint: string,
  scheduleId: string
): Promise<ScheduleSubscription | undefined> => {
  const [scheduleSubscription] = await db.query(
    `
      SELECT
        ss.id, ss.pushSubscriptionId, ss.scheduleId, ss.enabled
      FROM schedule_subscriptions ss
        INNER JOIN push_subscriptions ps
          ON (
            ps.id = ss.pushSubscriptionId
            AND ps.endpoint = :endpoint
          )
      WHERE scheduleId = :scheduleId
    `,
    {
      endpoint,
      scheduleId,
    }
  );

  if (scheduleSubscription) {
    return {
      id: scheduleSubscription.id as string,
      endpoint,
      pushSubscriptionId: scheduleSubscription.pushSubscriptionId as string,
      scheduleId: scheduleSubscription.scheduleId as string,
      enabled: !!scheduleSubscription.enabled,
    };
  }
};
