import User from './user';

type SanitizedUser = Omit<User, 'password'>;

export default (user: User): SanitizedUser => ({
  id: user.id,
  username: user.username,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  token: user.token,
});
