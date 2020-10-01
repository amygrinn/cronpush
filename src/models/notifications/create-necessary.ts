import cronParser from 'cron-parser';
import dateToMySQL from '../../util';
import * as db from '../db';
import createId from '../util/create-id';
import create from './create';
import Notification from './notification';

export default (now = new Date()) =>
  db.useConnection(async (query) => {
    const exactMinute = new Date(now.valueOf());
    exactMinute.setSeconds(0, 0);
    const justBefore = new Date(now.valueOf());
    justBefore.setSeconds(-1, 0);

    const schedulesWithoutPendingNotifications = (await query(
      `
        SELECT
          s.cronExpression,
          ps.timeZone,
          ss.id AS scheduleSubscriptionId
        FROM schedule_subscriptions ss
          LEFT JOIN schedules s
            ON s.id = ss.scheduleId
          LEFT JOIN push_subscriptions ps
            ON ps.id = ss.pushSubscriptionId
          LEFT JOIN notifications n
            ON (
              n.scheduleSubscriptionId = ss.id
              AND n.date >= :date
            )
        WHERE n.id IS NULL
      `,
      { date: dateToMySQL(exactMinute) }
    )) as {
      cronExpression: string;
      timeZone: string;
      scheduleSubscriptionId: string;
    }[];

    const notificationsToCreate: Notification[] = schedulesWithoutPendingNotifications.map(
      (s) => {
        const date = cronParser
          .parseExpression(s.cronExpression, {
            tz: s.timeZone,
            currentDate: justBefore,
          })
          .next()
          .toDate();

        return {
          id: createId(),
          date: dateToMySQL(date),
          scheduleSubscriptionId: s.scheduleSubscriptionId,
          sent: false,
        };
      }
    );

    if (notificationsToCreate.length > 0) {
      await create(notificationsToCreate);
    }
  });
