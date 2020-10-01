import * as db from '../db';
import { Schedule } from '../schedules';

export default async ({
  endpoint,
  userId,
}: {
  endpoint: string;
  userId?: string;
}): Promise<Schedule[]> =>
  db
    .query(
      `
        SELECT
          s.id, s.cronExpression, s.title, s.icon, s.message, s.userId,
          (ss.enabled AND ps.enabled AND ps.endpoint = :endpoint) AS enabled
        FROM schedule_subscriptions ss
          INNER JOIN push_subscriptions ps
            ON (
              ps.id = ss.pushSubscriptionId
              AND (
                ps.endpoint = :endpoint
                OR ps.userId = :userId
              )
            )
          INNER JOIN schedules s ON s.id = ss.scheduleId
      `,
      {
        endpoint,
        userId: userId as string,
      }
    )
    .then((result) =>
      result.map((s) => ({
        id: s.id as string,
        cronExpression: s.cronExpression as string,
        title: s.title as string,
        icon: s.icon as string,
        message: s.message as string,
        userId: s.userId as string,
        enabled: !!s.enabled,
      }))
    );
