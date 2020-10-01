import * as db from '../db';
import Schedule from './schedule';

export default async (id: string): Promise<Schedule | undefined> => {
  const [result] = await db.query(
    `
      SELECT id, cronExpression, title, icon, message, userId
      FROM schedules
      WHERE id = :id
    `,
    { id }
  );

  if (result) {
    return {
      id: result.id as string,
      cronExpression: result.cronExpression as string,
      title: result.title as string,
      icon: result.icon as string,
      message: result.message as string,
      userId: result.userId as string,
    };
  }
};
