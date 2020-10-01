import * as db from '../db';
import createId from '../util/create-id';

export default (endpoint: string, scheduleId: string, enabled: boolean) =>
  db.query(
    `
      INSERT INTO schedule_subscriptions (
        pushSubscriptionId,
        id, scheduleId, enabled
      ) VALUES (
        (SELECT id FROM push_subscriptions WHERE endpoint = :endpoint),
        :id, :scheduleId, :enabled
      )
    `,
    {
      id: createId(),
      endpoint,
      scheduleId,
      enabled: Number(enabled),
    }
  );
