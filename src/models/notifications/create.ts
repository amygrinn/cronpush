import * as db from '../db';
import Notification from './notification';

export default async (notifications: Notification[]) => {
  if (notifications.length > 0) {
    // prettier-ignore
    return db.query(`
      INSERT INTO notifications
        (id, date, scheduleSubscriptionId, sent)
      VALUES
        ${notifications.map((n) =>
          `('${n.id}', '${n.date}', '${n.scheduleSubscriptionId}', ${n.sent}),`
        ).join('\n').slice(0, -1)}
    `);
  }
};
