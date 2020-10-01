import * as db from '../db';
import createId from '../util/create-id';
import Schedule from './schedule';

interface CreateScheduleObject extends Partial<Schedule> {
  cronExpression: string;
  title: string;
}

export default async (schedule: CreateScheduleObject): Promise<Schedule> => {
  const newSchedule = {
    id: createId(),
    userId: schedule.userId || '',
    cronExpression: schedule.cronExpression,
    title: schedule.title,
    icon: schedule.icon || '/icons/star.png',
    message: schedule.message || '',
  };

  await db.query(
    `
      INSERT INTO schedules (
        id, userId, cronExpression, title, icon, message
      ) VALUES (
        :id, :userId, :cronExpression, :title, :icon, :message
      )
    `,
    newSchedule
  );

  return newSchedule;
};
