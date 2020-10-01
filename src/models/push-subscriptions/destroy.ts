import * as db from '../db';

export default (endpoint: string) =>
  db.query(
    `
      DELETE
      FROM push_subscriptions
      WHERE endpoint = :endpoint
    `,
    { endpoint }
  );
