import * as db from '../db';
import Schedule from './schedule';

export default (schedule: Schedule) =>
  db.query(
    `
    UPDATE schedules
    SET
      ${schedule.userId ? 'userId = :userId,' : ''}
      ${schedule.message ? 'message = :title,' : ''}
      ${schedule.icon ? 'icon = :icon,' : ''}
      cronExpression = :cronExpression,
      title = :title
    WHERE id = :id
  `,
    {
      id: schedule.id,
      userId: schedule.userId as string,
      cronExpression: schedule.cronExpression,
      title: schedule.title,
      message: schedule.message as string,
      icon: schedule.icon as string,
    }
  );
