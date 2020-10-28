import * as db from '../db';

const TABLE_NAME = 'notifications';

export default () =>
  db.useConnection(async (query) => {
    if (process.env.NODE_ENV === 'test') {
      await query(`DROP TABLE IF EXISTS ${TABLE_NAME}`);
    }

    await query(`
      CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
        id VARCHAR(255) NOT NULL,
        sent TINYINT(1) DEFAULT 0,
        date DATETIME NOT NULL,
        scheduleSubscriptionId VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP NOT NULL,
        updatedAt TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
        PRIMARY KEY (id)
      )
    `);
  });
