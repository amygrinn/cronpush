import * as db from '../db';
import createId from '../util/create-id';
import find from './find';
import User from './user';

interface CreateUserObject extends Partial<User> {
  username: string;
  password: string;
}

export default async (info: CreateUserObject): Promise<User> => {
  const id = createId();

  await db.query(
    `
      INSERT INTO users (
        id, username, password
      ) VALUES (
        :id, :username, :password
      )
    `,
    {
      id,
      username: info.username,
      password: info.password,
    }
  );

  return find({ id }) as Promise<User>;
};
