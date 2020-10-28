import cronParser from 'cron-parser';
import { pushSubscriptions } from '..';
import dateToMySQL from '../../util';
import * as db from '../db';
import createId from '../util/create-id';
import create from './create';
import Notification from './notification';

export default async (now = new Date()) => {
  const exactMinute = new Date(now.valueOf());
  exactMinute.setSeconds(0, 0);
  const justBefore = new Date(now.valueOf());
  justBefore.setSeconds(-1, 0);

  const schedulesWithoutPendingNotifications = await db.query<
    {
      cronExpression: string;
      timeZone: string;
      scheduleSubscriptionId: string;
      endpoint: string;
    },
    { date: string }
  >(
    `
      SELECT
        s.cronExpression,
        ps.timeZone,
        ss.id AS scheduleSubscriptionId,
        ps.endpoint
      FROM schedule_subscriptions ss
        INNER JOIN schedules s
          ON s.id = ss.scheduleId
        INNER JOIN push_subscriptions ps
          ON (
            ps.id = ss.pushSubscriptionId
            AND ps.enabled
          )
        LEFT JOIN notifications n
          ON (
            n.scheduleSubscriptionId = ss.id
            AND n.date >= :date
          )
      WHERE
        n.id IS NULL
        AND ss.enabled
    `,
    { date: dateToMySQL(exactMinute) }
  );

  const notificationsToCreate: Notification[] = schedulesWithoutPendingNotifications.reduce(
    (notifications, s) => {
      try {
        const date = cronParser
          .parseExpression(s.cronExpression, {
            tz: s.timeZone,
            currentDate: justBefore,
          })
          .next()
          .toDate();

        notifications.push({
          id: createId(),
          date: dateToMySQL(date),
          scheduleSubscriptionId: s.scheduleSubscriptionId,
          sent: false,
        });
      } catch (err) {
        console.error(err);
        console.log(s);
        if (s.endpoint) pushSubscriptions.destroy(s.endpoint);
      }
      return notifications;
    },
    [] as Notification[]
  );

  if (notificationsToCreate.length > 0) {
    await create(notificationsToCreate);
  }
};
