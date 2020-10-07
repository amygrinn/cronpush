import dateToMySQL from '../../util';
import * as db from '../db';
import PushSubscription from '../push-subscriptions/push-subscription';
import Schedule from '../schedules/schedule';
import Notification from './notification';

export default async (
  now = new Date()
): Promise<
  Array<Notification & Schedule & PushSubscription & { scheduleId: string }>
> => {
  const exactMinute = new Date(now.valueOf());
  exactMinute.setSeconds(0, 0);

  const result = await db.query(
    `
      SELECT
        n.id, n.date, n.sent, n.scheduleSubscriptionId,
        s.id AS scheduleId, s.cronExpression, s.title, s.icon, s.message, s.userId,
        ps.endpoint, ps.timeZone, ps.p256dh, ps.auth
      FROM notifications n
        INNER JOIN schedule_subscriptions ss
          ON (
            ss.id = n.scheduleSubscriptionId
            AND ss.enabled
          )
        LEFT JOIN schedules s ON s.id = ss.scheduleId
        LEFT JOIN push_subscriptions ps
          ON (
            ps.id = ss.pushSubscriptionId
            AND ps.enabled
          )
      WHERE
        date = :date
        AND sent = 0
    `,
    { date: dateToMySQL(exactMinute) }
  );

  return result.map((n) => ({
    id: n.id as string,
    enabled: true,
    date: n.date as string,
    sent: !!n.sent,
    scheduleSubscriptionId: n.scheduleSubscriptionId as string,
    cronExpression: n.cronExpression as string,
    title: n.title as string,
    icon: n.icon as string,
    message: n.message as string,
    userId: n.userId as string,
    endpoint: n.endpoint as string,
    timeZone: n.timeZone as string,
    keys: {
      p256dh: n.p256dh as string,
      auth: n.auth as string,
    },
    scheduleId: n.scheduleId as string,
  }));
};
