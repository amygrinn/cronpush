import * as Sequelize from 'sequelize';

import { Notifications, ScheduleSubscriptions } from 'src/models';
import { dateToMySQL } from 'src/util';

export default async (scheduleId: string) => {
  const notifications = await Notifications.findAll({
    include: [{
      model: ScheduleSubscriptions,
      as: 'scheduleSubscription',
      where: { scheduleId },
    }],
    where: {
      sent: false,
      date: {
        [Sequelize.Op.gte]: dateToMySQL(new Date()),
      },
    },
  });

  const ids = notifications.map((n) => n.id);

  await Notifications.destroy({
    where: { id: { [Sequelize.Op.in]: ids } },
  });
};
