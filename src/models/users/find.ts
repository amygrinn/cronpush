import * as db from '../db';
import XOR from '../util/x-or';
import User from './user';

export default async (
  query: XOR<{ username: string }, { id: string }>
): Promise<User | undefined> => {
  const [user] = await db.query(
    `
    SELECT
      id, username, createdAt, updatedAt, password
    FROM users
    WHERE
      ${query.username ? 'username = :username' : 'id = :id'}
    `,
    {
      username: query.username as string,
      id: query.id as string,
    }
  );

  if (user) {
    return {
      id: user.id as string,
      username: user.username as string,
      createdAt: user.createdAt as string,
      updatedAt: user.updatedAt as string,
      password: user.password as string,
    };
  }

  return undefined;
};
