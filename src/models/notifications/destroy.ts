import * as db from '../db';

export default (scheduleId: string) =>
  db.query(
    `
      DELETE n
      FROM notifications n
        INNER JOIN schedule_subscriptions ss
          ON (
            ss.id = n.scheduleSubscriptionId
            AND ss.scheduleId = :scheduleId
          )
    `,
    { scheduleId }
  );
