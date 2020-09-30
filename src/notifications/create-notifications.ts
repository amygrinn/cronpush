import cronParser from 'cron-parser';
import * as Sequelize from 'sequelize';
import {
  Notifications,
  PushSubscriptions,
  Schedules,
  ScheduleSubscriptions,
} from '../models';
import dateToMySQL from '../util';

export default async (now = new Date()) => {
  const nextMinute = new Date(now.valueOf());
  nextMinute.setSeconds(60, 0);

  let notificationsToCreate = await ScheduleSubscriptions.findAll({
    include: [
      Schedules, // JOIN
      {
        // INNER JOIN enabled push subscriptions
        model: PushSubscriptions,
        as: 'pushSubscription',
        where: { enabled: true },
      },
      {
        // JOIN future notifications
        model: Notifications,
        where: {
          date: {
            [Sequelize.Op.gte]: dateToMySQL(nextMinute),
          },
        },
        required: false,
      },
    ],
    where: {
      enabled: true,
    },
  });

  console.log('notificationz: ', notificationsToCreate.length);

  return Promise.all(
    notificationsToCreate.map(async (n) => {
      const date = cronParser
        .parseExpression(n.schedule!.cronExpression, {
          tz: n.pushSubscription!.timeZone,
          currentDate: now,
        })
        .next()
        .toDate();

      const notification = await Notifications.create({ sent: false, date });
      return notification.setScheduleSubscription(n);
    })
  );
};
