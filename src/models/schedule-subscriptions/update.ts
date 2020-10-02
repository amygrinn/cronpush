import * as db from '../db';
import ScheduleSubscription from './schedule-subscription';

export default async (scheduleSubscription: ScheduleSubscription) => {
  await db.query(
    `
      UPDATE schedule_subscriptions
      SET enabled = :enabled
      WHERE id = :id
    `,
    {
      id: scheduleSubscription.id,
      enabled: Number(scheduleSubscription.enabled),
    }
  );
};
