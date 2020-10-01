import * as db from '../db';

const TABLE_NAME = 'schedules';

export default () =>
  db.useConnection(async (query) => {
    if (process.env.NODE_ENV === 'test') {
      await query(`DROP TABLE IF EXISTS ${TABLE_NAME}`);
    }

    await query(`
      CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
        id VARCHAR(255) NOT NULL,
        userId VARCHAR(255) NOT NULL,
        cronExpression VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message VARCHAR(255) NOT NULL,
        icon VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP NOT NULL,
        updatedAt TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
        PRIMARY KEY (id)
      )
    `);
  });
