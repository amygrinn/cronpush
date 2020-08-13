import * as Sequelize from 'sequelize';
import cronParser from 'cron-parser';

import dateToMySQL from '../util';

import {
  Notifications,
  ScheduleSubscriptions,
  PushSubscriptions,
  Schedules,
} from '../models';

export default async (now: Date) => {
  let notificationsToCreate = await ScheduleSubscriptions.findAll({
    include: [
      Schedules,
      {
        model: PushSubscriptions,
        as: 'pushSubscription',
        where: { enabled: true },
      },
      {
        model: Notifications,
        where: {
          sent: false,
          date: {
            [Sequelize.Op.gte]: dateToMySQL(now),
          },
        },
        required: false,
      },
    ],
    where: { enabled: true },
  });

  notificationsToCreate = notificationsToCreate.filter((n) => n!.notifications!.length < 1);

  await Promise.all(notificationsToCreate.map(async (n) => {
    now.setSeconds(-1);
    const date = cronParser.parseExpression(
      n.schedule!.cronExpression,
      {
        tz: n.pushSubscription!.timeZone,
        currentDate: now,
      },
    ).next().toDate();

    const notificationExists = await Notifications.findOne({
      include: [{
        model: ScheduleSubscriptions,
        as: 'scheduleSubscription',
        where: {
          scheduleId: n.scheduleId,
        },
      }],
      where: {
        date: dateToMySQL(date),
      },
    });

    if (!notificationExists) {
      const notification = await Notifications.create({ sent: false, date });
      await notification.setScheduleSubscription(n);
    }
  }));
};
