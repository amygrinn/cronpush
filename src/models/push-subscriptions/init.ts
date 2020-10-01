import * as db from '../db';

const TABLE_NAME = 'push_subscriptions';

export default () =>
  db.useConnection(async (query) => {
    if (process.env.NODE_ENV === 'test') {
      await query(`DROP TABLE IF EXISTS ${TABLE_NAME}`);
    }

    await query(`
      CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
        id VARCHAR(255) NOT NULL,
        userId VARCHAR(255) NOT NULL,
        enabled TINYINT(1) DEFAULT 1,
        endpoint TEXT NOT NULL,
        p256dh VARCHAR(255) NOT NULL,
        auth VARCHAR(255) NOT NULL,
        timeZone VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP NOT NULL,
        updatedAt TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
        PRIMARY KEY (id)
      )
    `);
  });
