import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { Users } from '../../../models';

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
  if (await Users.findOne({ where: { username } })) {
    done('User already exists');
  } else {
    const hash = await bcrypt.hash(password, 10);
    const user = await Users.create({ username, password: hash });
    user.token = await signJwt(user.sanitized());
    done(null, user);
  }
});

export const login = new LocalStrategy(async (username, password, done) => {
  const user = await Users.findOne({ where: { username } });

  if (!user) {
    done('User does not exist');
  } else if (!(await bcrypt.compare(password, user.password))) {
    done('Incorrect password');
  } else {
    user.token = await signJwt(user.sanitized());
    done(null, user);
  }
});

export const jwt = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  },
  async (payload, done) => {
    const user = await Users.findOne({ where: { id: payload.id } });
    if (!user) {
      done(new Error('User does not exist'));
    }
    done(null, user);
  }
);
