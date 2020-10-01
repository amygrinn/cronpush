import * as db from '../db';

export default async (username: string): Promise<boolean> => {
  const [
    { userExists },
  ] = await db.query(
    'SELECT COUNT(*) AS userExists FROM users WHERE username = :username',
    { username }
  );

  return !!userExists;
};
