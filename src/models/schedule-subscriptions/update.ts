import * as db from '../db';
import ScheduleSubscription from './schedule-subscription';

export default async (scheduleSubscription: ScheduleSubscription) => {
  await db.query(
    `
      UPDATE schedule_subscriptions ss
        INNER JOIN push_subscriptions ps
          ON (
            ps.id = ss.pushSubscriptionId
            AND ps.endpoint = :endpoint
          )
      SET ss.enabled = :enabled
      WHERE ss.scheduleId = :scheduleId
    `,
    {
      endpoint: scheduleSubscription.pushSubscriptionId,
      scheduleId: scheduleSubscription.scheduleId,
      enabled: Number(scheduleSubscription.enabled),
    }
  );
};
