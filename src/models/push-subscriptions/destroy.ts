import * as db from '../db';

export default (endpoint: string) =>
  db.query(
    `
        DELETE ps, ss
        FROM schedule_subscriptions ss
          INNER JOIN push_subscriptions ps
            ON (
              ps.endpoint = :endpoint
              AND ss.pushSubscriptionId = ps.id
            )
      `,
    { endpoint }
  );
