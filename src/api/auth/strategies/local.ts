import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { users } from '../../../models';

const signJwt = (payload: any) =>
  new Promise<string>((resolve, reject) => {
    jsonwebtoken.sign(
      payload,
      process.env.JWT_SECRET!,
      (err?: Error | null, token?: string) =>
        err ? reject(err) : resolve(token)
    );
  });

export const register = new LocalStrategy(async (username, password, done) => {
  if (await users.exists(username)) {
    done('User already exists');
  } else {
    const hash = await bcrypt.hash(password, 10);
    const user = await users.create({ username, password: hash });
    user.token = await signJwt(users.sanitize(user));
    done(null, user);
  }
});

export const login = new LocalStrategy(async (username, password, done) => {
  const user = await users.find({ username });

  if (!user) {
    done('User does not exist');
  } else if (!(await bcrypt.compare(password, user.password))) {
    done('Incorrect password');
  } else {
    user.token = await signJwt(users.sanitize(user));
    done(null, user);
  }
});

export const jwt = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  },
  async ({ id }, done) => {
    const user = await users.find({ id });
    if (!user) {
      done(new Error('User does not exist'));
    }
    done(null, user);
  }
);
