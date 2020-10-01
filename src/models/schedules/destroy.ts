import * as db from '../db';

export default async (id: string) =>
  db.query(
    `
      DELETE FROM schedules
      WHERE id = :id
    `,
    { id }
  );
